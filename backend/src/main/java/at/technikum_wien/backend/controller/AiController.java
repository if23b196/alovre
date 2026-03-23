package at.technikum_wien.backend.controller;

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

    // Translation / Explanation
    @PostMapping("/explain")
    public ResponseEntity<AnnotationResponse> explainText(
            @RequestBody AnnotationRequest request) {

        Annotation annotation = aiService.generateTranslation(
                request.getContentId(),
                request.getWord()
        );

        return ResponseEntity.ok(
                new AnnotationResponse(
                        annotation.getSelectedText(),
                        annotation.getGeneratedText()
                )
        );
    }

    // Optional: separate translation endpoint
    @PostMapping("/translate")
    public Map<String, Object> translateText(@RequestBody Map<String, String> request) {
        // TODO: call AI to translate text
        return null;
    }

    // 5. Image generation
    @PostMapping("/image")
    public Map<String, Object> generateImage(@RequestBody Map<String, String> request) {
        // TODO: call AI to generate image
        return null;
    }

    // 6. Text-to-speech
    @PostMapping("/tts")
    public Map<String, Object> textToSpeech(@RequestBody Map<String, String> request) {
        // TODO: call TTS service
        return null;
    }
}