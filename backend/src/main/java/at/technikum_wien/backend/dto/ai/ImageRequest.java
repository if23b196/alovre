package at.technikum_wien.backend.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ImageRequest {
    private Long contentId;
    private String word;
    private String context; // optional, AI may use it
}