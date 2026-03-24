package at.technikum_wien.backend.controller;

import at.technikum_wien.backend.dto.content.*;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.util.List;

import at.technikum_wien.backend.model.Content;
import at.technikum_wien.backend.service.ContentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

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
    public ResponseEntity<List<ContentListResponse>> getAllContent() {

        List<ContentListResponse> contentList = contentService.getAllContent();

        return ResponseEntity.ok(contentList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentDetailResponse> getContentById(@PathVariable Long id) {

        ContentDetailResponse response = contentService.getContentById(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContent(@PathVariable Long id) {

        contentService.deleteContent(id);
        return ResponseEntity.noContent().build();
    }

    // 9. Update content title
    @PutMapping("/{id}")
    public ResponseEntity<Content> updateTitle(
            @PathVariable Long id,
            @RequestBody @Valid UpdateTitleRequest request) {

        Content updated = contentService.updateTitle(id, request.getTitle());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/image/{objectKey}")
    public ResponseEntity<InputStreamResource> getImage(@PathVariable String objectKey) {

        InputStream is = contentService.getFile(objectKey);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + objectKey + "\"")
                .contentType(MediaType.IMAGE_PNG) // adjust if needed
                .body(new InputStreamResource(is));
    }

    @GetMapping("/audio/{objectKey}")
    public ResponseEntity<InputStreamResource> getAudio(@PathVariable String objectKey) {

        InputStream is = contentService.getFile(objectKey);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + objectKey + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM) // or audio/mpeg
                .body(new InputStreamResource(is));
    }
}
