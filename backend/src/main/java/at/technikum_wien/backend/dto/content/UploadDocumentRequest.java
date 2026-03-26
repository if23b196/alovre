package at.technikum_wien.backend.dto.content;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UploadDocumentRequest {

    @NotBlank(message = "Title must not be empty")
    private String title;

    @NotNull(message = "File must not be null")
    private MultipartFile file;

    private String language;
}