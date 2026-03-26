package at.technikum_wien.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "content")
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "language", nullable = false)
    private String language;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ContentType type; // PDF, TXT, TEXT

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "upload_timestamp", nullable = false)
    private LocalDateTime uploadTimestamp;

    @Column(name = "minio_object_key")
    private String minioObjectKey;

    @Column(columnDefinition = "TEXT")
    private String textContent;

    @Column(name = "ocr_processed")
    private Boolean ocrProcessed = false;

    // One content can have many annotations
    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Annotation> annotations = new ArrayList<>();

    // One content can have many images
    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images = new ArrayList<>();

    // One content can have many audio files
    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Audio> audios = new ArrayList<>();

    public enum ContentType {
        PDF, TXT, TEXT
    }
}
