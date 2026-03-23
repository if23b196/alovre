package at.technikum_wien.backend.service;

import at.technikum_wien.backend.model.Annotation;
import at.technikum_wien.backend.model.Content;
import at.technikum_wien.backend.model.Image;
import at.technikum_wien.backend.repository.AnnotationRepository;
import at.technikum_wien.backend.repository.ContentRepository;
import at.technikum_wien.backend.repository.ImageRepository;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AiService {

    private final AnnotationRepository annotationRepository;
    private final ImageRepository imageRepository;
    private final ContentRepository contentRepository;
    private final StorageService storageService;

    // Gemini client (reuse)
    private final Client client = new Client();

    // -----------------------------
    // TRANSLATION
    // -----------------------------
    public Annotation generateTranslation(Long contentId, String word) {

        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        String prompt = "Translate the word '" + word + "' to German. Only return the translation.";

        GenerateContentResponse response = client.models.generateContent(
                "gemini-2.5-flash-lite",
                prompt,
                null
        );

        String result = response.text();

        Annotation annotation = new Annotation();
        annotation.setContent(content);
        annotation.setLanguage("DE");
        annotation.setSelectedText(word);
        annotation.setGeneratedText(result.trim());
        annotation.setGeneratedTimestamp(LocalDateTime.now());

        return annotationRepository.save(annotation);
    }

    // -----------------------------
    // IMAGE GENERATION
    // -----------------------------
    public Image generateImage(Long contentId, String word) {

        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        GenerateContentConfig config = GenerateContentConfig.builder()
                .responseModalities("TEXT", "IMAGE")
                .build();

        GenerateContentResponse response = client.models.generateContent(
                "gemini-2.5-flash-image",
                "Create an image representing: " + word,
                config
        );

        byte[] imageBytes = null;

        for (Part part : response.parts()) {
            if (part.inlineData().isPresent() &&
                    part.inlineData().get().data().isPresent()) {

                imageBytes = part.inlineData().get().data().get();
                break;
            }
        }

        if (imageBytes == null) {
            throw new RuntimeException("No image returned from Gemini");
        }

        // Upload to MinIO
        String objectKey = storageService.uploadBytes(imageBytes, word + ".png");

        Image image = new Image();
        image.setContent(content);
        image.setSelectedText(word);
        image.setMinioObjectKey(objectKey);
        image.setGeneratedTimestamp(LocalDateTime.now());

        return imageRepository.save(image);
    }
}
