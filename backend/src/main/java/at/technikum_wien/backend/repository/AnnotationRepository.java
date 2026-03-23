package at.technikum_wien.backend.repository;

import at.technikum_wien.backend.model.Annotation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnnotationRepository extends JpaRepository<Annotation, Long> {
}