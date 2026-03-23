package at.technikum_wien.backend.repository;

import at.technikum_wien.backend.model.Audio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AudioRepository extends JpaRepository<Audio, Long> {
}