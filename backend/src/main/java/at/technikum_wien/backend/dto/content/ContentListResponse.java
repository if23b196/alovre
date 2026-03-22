package at.technikum_wien.backend.dto.content;

import at.technikum_wien.backend.model.Content;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContentListResponse {

    private Long id;
    private String title;
    private Content.ContentType type;
    private Long fileSize;
    private LocalDateTime uploadTimestamp;
    private Boolean ocrProcessed;
}