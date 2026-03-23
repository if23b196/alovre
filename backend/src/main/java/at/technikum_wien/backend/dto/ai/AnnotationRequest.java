package at.technikum_wien.backend.dto.ai;

import lombok.*;

@Getter
@Setter
public class AnnotationRequest {
    private Long contentId;
    private String word;
}