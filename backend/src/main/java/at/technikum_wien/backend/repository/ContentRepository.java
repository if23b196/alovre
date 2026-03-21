package at.technikum_wien.backend.repository;

import at.technikum_wien.backend.model.Content;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContentRepository extends JpaRepository<Content, Long> {
}