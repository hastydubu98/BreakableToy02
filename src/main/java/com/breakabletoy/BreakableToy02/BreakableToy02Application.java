package com.breakabletoy.BreakableToy02;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class BreakableToy02Application {

	public static void main(String[] args) {
		SpringApplication.run(BreakableToy02Application.class, args);
	}

	// Add CORS configuration inside the main application class
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**") // Apply to all endpoints
						.allowedOrigins("http://localhost:5173") // Allow requests from localhost:3000
						.allowedMethods("GET", "POST", "PUT", "DELETE") // Allow specific HTTP methods
						.allowedHeaders("*") // Allow all headers
						.allowCredentials(true); // Allow credentials (cookies, authorization headers, etc.)
			}
		};
	}

}
