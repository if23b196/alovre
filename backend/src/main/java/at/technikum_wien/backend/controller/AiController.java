package at.technikum_wien.backend.controller;

import at.technikum_wien.backend.dto.ai.ImageRequest;
import at.technikum_wien.backend.model.Image;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import at.technikum_wien.backend.dto.ai.AnnotationRequest;
import at.technikum_wien.backend.dto.ai.AnnotationResponse;
import at.technikum_wien.backend.model.Annotation;
import at.technikum_wien.backend.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/explain")
    public ResponseEntity<AnnotationResponse> explainText(
            @RequestBody AnnotationRequest request) {

        Annotation annotation = aiService.generateTranslation(
                request.getContentId(),
                request.getWord(),
                request.getLanguage(),
                request.getContext()
        );

        return ResponseEntity.ok(
                new AnnotationResponse(
                        annotation.getSelectedText(),
                        annotation.getGeneratedText()
                )
        );
    }

    // 5. Image generation
    @PostMapping("/image")
    public ResponseEntity<Map<String, String>> generateImage(@RequestBody ImageRequest request) {

        Image image = aiService.generateImage(
                request.getContentId(),
                request.getWord(),
                request.getContext()
        );

        Map<String, String> response = Map.of("imageKey", image.getMinioObjectKey());
        return ResponseEntity.ok(response);
    }

    // 6. Text-to-speech
    @PostMapping("/tts")
    public Map<String, Object> textToSpeech(@RequestBody Map<String, String> request) {
        // TODO: call TTS service
        return null;
    }
}