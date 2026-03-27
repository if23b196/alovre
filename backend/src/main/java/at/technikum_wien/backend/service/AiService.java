package at.technikum_wien.backend.service;

import at.technikum_wien.backend.model.Annotation;
import at.technikum_wien.backend.model.Audio;
import at.technikum_wien.backend.model.Content;
import at.technikum_wien.backend.model.Image;
import at.technikum_wien.backend.repository.AnnotationRepository;
import at.technikum_wien.backend.repository.AudioRepository;
import at.technikum_wien.backend.repository.ContentRepository;
import at.technikum_wien.backend.repository.ImageRepository;

import com.google.genai.Client;
import com.google.genai.types.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiService {

    private final AnnotationRepository annotationRepository;
    private final ImageRepository imageRepository;
    private final AudioRepository audioRepository;
    private final ContentRepository contentRepository;
    private final StorageService storageService;

    // Gemini client (reuse)
    private final Client client = new Client();

    // -----------------------------
    // TRANSLATION
    // -----------------------------
    public Annotation generateTranslation(Long contentId,
                                          String word,
                                          String targetLanguage,
                                          String context) {

        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        String prompt = """
                Only answer with valid JSON.
                
                Translate the word "%s" from %s into %s using the context below.
                Then explain the word very briefly in ONE sentence in %s.
                
                Context:
                "%s"
                
                Return JSON:
                {
                  "translation": "...",
                  "explanation": "..."
                }
                """.formatted(word, content.getLanguage(), targetLanguage, content.getLanguage(), context);

        GenerateContentResponse response = client.models.generateContent(
                "gemini-2.5-flash-lite",
                prompt,
                null
        );

        String result = response.text();

        String translation = result.split("\"translation\"\\s*:\\s*\"")[1].split("\"")[0];
        String explanation = result.split("\"explanation\"\\s*:\\s*\"")[1].split("\"")[0];

        String combined = "'" + translation + "' - " + explanation;

        Annotation annotation = new Annotation();
        annotation.setContent(content);
        annotation.setLanguage(targetLanguage.toUpperCase());
        annotation.setSelectedText(word);
        annotation.setGeneratedText(combined);
        annotation.setGeneratedTimestamp(LocalDateTime.now());

        return annotationRepository.save(annotation);
    }

    // -----------------------------
    // IMAGE GENERATION
    // -----------------------------
    public Image generateImage(Long contentId, String word, String context) {

        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        // -----------------------------
        // Nano Banana 2 Prompt Building
        // -----------------------------
        String prompt = """
                You are generating an educational image for a language learning app.
                
                Goal:
                Create a clear, simple, and visually unambiguous image that represents the meaning of the word.
                
                Word:
                "%s"
                
                Text language:
                %s
                
                Context:
                "%s"
                
                Instructions:
                - Use the context to determine the correct meaning of the word.
                - If the word has multiple meanings, choose ONLY the meaning that fits the context.
                - The image must be easy to understand for learners (no abstract or symbolic visuals).
                - Focus on ONE main subject.
                - Avoid text inside the image.
                - Avoid artistic or complex styles.
                - Use a clean, realistic, or simple illustration style.
                - Make the subject large and centered.
                
                Output:
                Return ONLY the generated image.
                """.formatted(
                word,
                content.getLanguage(),
                context != null ? context : ""
        );

        // Nano Banana uses GenerateContentConfig with responseModalities
        com.google.genai.types.GenerateContentConfig config = com.google.genai.types.GenerateContentConfig.builder()
                .responseModalities(java.util.List.of("TEXT", "IMAGE"))
                .build();

        // Use generateContent instead of generateImages
        com.google.genai.types.GenerateContentResponse response = client.models.generateContent(
                "gemini-2.5-flash-image",
                prompt,
                config
        );

        byte[] imageBytes = null;

        // Iterate through the parts to find the image data
        if (response.candidates().isPresent() && !response.candidates().get().isEmpty()) {
            com.google.genai.types.Candidate candidate = response.candidates().get().getFirst();

            // Check if content exists
            if (candidate.content().isPresent()) {
                // Check if parts() Optional is present
                if (candidate.content().get().parts().isPresent()) {

                    // Unwrap the Optional to get the List<Part>
                    List<Part> parts = candidate.content().get().parts().get();

                    for (com.google.genai.types.Part part : parts) {
                        if (part.inlineData().isPresent()) {
                            com.google.genai.types.Blob blob = part.inlineData().get();
                            if (blob.data().isPresent()) {
                                imageBytes = blob.data().get();
                                break;
                            }
                        }
                    }
                }
            }
        }

        if (imageBytes == null) {
            throw new RuntimeException("Nano Banana did not return any image data. Check safety filters or quota.");
        }

        // -----------------------------
        // Upload to MinIO
        // -----------------------------
        String objectKey = storageService.uploadBytes(imageBytes, word + ".png");

        Image image = new Image();
        image.setContent(content);
        image.setSelectedText(word);
        image.setMinioObjectKey(objectKey);
        image.setGeneratedTimestamp(LocalDateTime.now());

        return imageRepository.save(image);
    }

    public Audio generateAudio(Long contentId, String word) {

        Content content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        // -----------------------------
        // Prompt (VERY important for pronunciation)
        // -----------------------------
        String prompt = "Pronounce clearly: \"" + word + "\"";

        // -----------------------------
        // Config (THIS is the key part)
        // -----------------------------
        GenerateContentConfig config = GenerateContentConfig.builder()
                .responseModalities(List.of("AUDIO"))
                .speechConfig(
                        SpeechConfig.builder()
                                .voiceConfig(
                                        VoiceConfig.builder()
                                                .prebuiltVoiceConfig(
                                                        PrebuiltVoiceConfig.builder()
                                                                .voiceName("Kore") // you can change later
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        GenerateContentResponse response = client.models.generateContent(
                "gemini-2.5-flash-preview-tts",
                prompt,
                config
        );

        byte[] audioBytes = null;

        // -----------------------------
        // Extract AUDIO (same pattern as image)
        // -----------------------------
        if (response.candidates().isPresent() && !response.candidates().get().isEmpty()) {
            Candidate candidate = response.candidates().get().get(0);

            if (candidate.content().isPresent() &&
                    candidate.content().get().parts().isPresent()) {

                List<Part> parts = candidate.content().get().parts().get();

                for (Part part : parts) {
                    if (part.inlineData().isPresent()) {
                        Blob blob = part.inlineData().get();
                        if (blob.data().isPresent()) {
                            audioBytes = blob.data().get(); // PCM data
                            break;
                        }
                    }
                }
            }
        }

        if (audioBytes == null) {
            throw new RuntimeException("No audio returned from Gemini");
        }

        // -----------------------------
        // Convert PCM → WAV (important for browser playback)
        // -----------------------------
        byte[] wavBytes = AudioUtil.convertPcmToWav(audioBytes, 24000, 1, 16);

        // -----------------------------
        // Upload to MinIO
        // -----------------------------
        String objectKey = storageService.uploadBytes(wavBytes, word + ".wav");

        Audio audio = new Audio();
        audio.setContent(content);
        audio.setText(word);
        audio.setMinioObjectKey(objectKey);
        audio.setVoice("Kore");
        audio.setGeneratedTimestamp(LocalDateTime.now());

        return audioRepository.save(audio);
    }
}
