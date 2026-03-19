package at.technikum_wien.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "annotation")
public class Annotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "content_id", nullable = false)
    private Content content;

    @Column(nullable = false)
    private String language;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String selectedText; // text selected by user

    @Column(columnDefinition = "TEXT", nullable = false)
    private String generatedText; // AI translation/explanation

    @Column(name = "generated_timestamp", nullable = false)
    private LocalDateTime generatedTimestamp;
}