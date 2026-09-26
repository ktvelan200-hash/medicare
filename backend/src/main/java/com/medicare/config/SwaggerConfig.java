package com.medicare.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    private static final String SCHEME_NAME = "BearerAuthentication";

    @Bean
    public OpenAPI medicareOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MediCare - Online Healthcare Management Platform API")
                        .description("REST API Documentation for MediCare platform. Features JWT authentication, appointment scheduling, doctor management, prescriptions, and medical records.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("MediCare Engineering Team")
                                .email("support@medicare.com")
                                .url("https://medicare-health.com"))
                        .license(new License().name("Apache 2.0").url("https://www.apache.org/licenses/LICENSE-2.0")))
                .addSecurityItem(new SecurityRequirement().addList(SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SCHEME_NAME, new SecurityScheme()
                                .name(SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Enter JWT Bearer token to authorize requests")));
    }
}
