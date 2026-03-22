package at.technikum_wien.backend.dto.content;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
public class UpdateTitleRequest {

    @NotBlank(message = "Title must not be empty")
    private String title;
}