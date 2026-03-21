package at.technikum_wien.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ocr")
@Getter
@Setter
public class OcrConfig {
    private String language = "eng";
    private String dataPath; // path to tessdata folder
}