package com.trimrr.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * Maps the existing Supabase `urls` table. Column names are set explicitly
 * so the snake_case DB columns bind to camelCase Java fields.
 *
 * NOTE: verify `id` type against your actual schema. Supabase tables created
 * via the dashboard default to bigint identity (mapped here as Long). If your
 * `urls.id` is a uuid, change the field + @Id type to UUID.
 */
@Entity
@Table(name = "urls")
@Getter
@Setter
@NoArgsConstructor
public class Url {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "original_url")
    private String originalUrl;

    @Column(name = "custom_url")
    private String customUrl;

    @Column(name = "short_url")
    private String shortUrl;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "qr")
    private String qr;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Instant createdAt;
}
