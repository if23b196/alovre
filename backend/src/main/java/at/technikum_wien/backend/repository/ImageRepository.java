package at.technikum_wien.backend.repository;

import at.technikum_wien.backend.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
}