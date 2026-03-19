package at.technikum_wien.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "image")
public class Image {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String selectedText; // the text used to generate the image

    @Column(name = "minio_object_key", nullable = false)
    private String minioObjectKey;

    @Column(name = "generated_timestamp", nullable = false)
    private LocalDateTime generatedTimestamp;
}