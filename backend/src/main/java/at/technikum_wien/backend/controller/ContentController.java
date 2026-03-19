package at.technikum_wien.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/content")
public class ContentController {

    // 1. Upload a PDF or TXT document
    @PostMapping("/upload/document")
    public void uploadDocument(@RequestParam("file") MultipartFile file) {
        // TODO: implement document upload
    }

    // 2. Upload raw text
    @PostMapping("/upload/text")
    public void uploadText(@RequestParam("title") String title,
                           @RequestParam("text") String text) {
        // TODO: implement text upload
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