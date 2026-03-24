package at.technikum_wien.backend.dto.content;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AnnotationDto {

    private Long id;
    private String language;
    private String selectedText;
    private String generatedText;
    private LocalDateTime generatedTimestamp;
}