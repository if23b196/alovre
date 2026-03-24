package at.technikum_wien.backend.dto.content;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ImageDto {

    private Long id;
    private String selectedText;
    private String minioObjectKey;
    private LocalDateTime generatedTimestamp;
}