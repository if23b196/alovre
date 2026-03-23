package at.technikum_wien.backend.dto.ai;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
public class AnnotationResponse {
    private String word;
    private String result;
}