package at.technikum_wien.backend.dto.content;

import java.time.LocalDateTime;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AudioDto {

    private Long id;

    private String text;

    private String minioObjectKey;

    private String voice;

    private LocalDateTime generatedTimestamp;
}
