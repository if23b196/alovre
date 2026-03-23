package at.technikum_wien.backend.dto.content;

import at.technikum_wien.backend.model.Annotation;
import at.technikum_wien.backend.model.Audio;
import at.technikum_wien.backend.model.Image;
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

    private List<Annotation> annotations;
    private List<Image> images;
    private List<Audio> audios;
}