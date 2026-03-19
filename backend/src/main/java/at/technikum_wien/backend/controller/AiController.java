package at.technikum_wien.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    // 4. Translation / Explanation endpoint
    @PostMapping("/explain")
    public Map<String, Object> explainText(@RequestBody Map<String, String> request) {
        // TODO: call AI to translate/explain text
        return null;
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