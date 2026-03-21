package at.technikum_wien.backend.controller;

import at.technikum_wien.backend.dto.content.UploadTextRequest;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import at.technikum_wien.backend.dto.content.UploadDocumentRequest;
import at.technikum_wien.backend.model.Content;
import at.technikum_wien.backend.service.ContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;

    @PostMapping("/upload/document")
    public ResponseEntity<Content> uploadDocument(
            @Valid @ModelAttribute UploadDocumentRequest request) {

        if (request.getFile().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Content saved = contentService.uploadDocument(
                request.getTitle(),
                request.getFile()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // 2. Upload raw text
    @PostMapping("/upload/text")
    public ResponseEntity<Content> uploadText(
            @Valid @RequestBody UploadTextRequest request) {

        Content saved = contentService.uploadText(
                request.getTitle(),
                request.getText()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // 3. Retrieve all content metadata
    @GetMapping
    public List<Object> getAllContent() {
        // TODO: return list of content (DTO)
        return null;
    }

    // 7. Retrieve single content by ID
    @GetMapping("/{id}")
    public Object getContentById(@PathVariable Long id) {
        // TODO: return content by ID
        return null;
    }

    // 8. Delete content by ID
    @DeleteMapping("/{id}")
    public void deleteContent(@PathVariable Long id) {
        // TODO: delete content
    }

    // Optional: Update content title
    @PutMapping("/{id}")
    public void updateContentTitle(@PathVariable Long id,
                                   @RequestParam("title") String title) {
        // TODO: update content title
    }
}