package at.technikum_wien.backend.dto.content;

import lombok.*;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ContentDetailResponse {

    private Long id;
    private String title;
    private String textContent;

    private List<AnnotationDto> annotations;
    private List<ImageDto> images;
    private List<AudioDto> audios;
}