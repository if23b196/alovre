package at.technikum_wien.backend.dto.content;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UploadTextRequest {

    @NotBlank(message = "Title must not be empty")
    private String title;

    @NotBlank(message = "Text must not be empty")
    private String text;

    private String language;
}