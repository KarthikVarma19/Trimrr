package com.trimrr.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Secures the REST API with the user's Supabase session token.
 *
 * Modern Supabase projects sign JWTs asymmetrically and publish their public
 * keys at a JWKS endpoint (/auth/v1/.well-known/jwks.json). We verify tokens
 * against that key set, so the backend trusts the same identity the frontend
 * logged in as — without holding any shared secret. The redirect ("/{code}")
 * and health endpoints stay public; everything under /api/** needs a token.
 */
@Configuration
public class SecurityConfig {

    private final String jwksUri;
    private final List<String> allowedOrigins;

    public SecurityConfig(
            @Value("${supabase.jwks-uri}") String jwksUri,
            @Value("${app.cors.allowed-origins}") List<String> allowedOrigins) {
        this.jwksUri = jwksUri;
        this.allowedOrigins = allowedOrigins;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll())
                .oauth2ResourceServer(oauth -> oauth.jwt(Customizer.withDefaults()));
        return http.build();
    }

    /**
     * Decoder that fetches Supabase's public signing keys from the JWKS URL.
     * Supabase signs with ES256 (EC keys); Spring defaults to RS256 only, so we
     * must declare ES256 explicitly or every token is rejected. RS256 is also
     * allowed in case the project is ever rotated to RSA keys.
     */
    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(jwksUri)
                .jwsAlgorithms(algs -> {
                    algs.add(SignatureAlgorithm.ES256);
                    algs.add(SignatureAlgorithm.RS256);
                })
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
