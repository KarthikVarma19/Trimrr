package com.trimrr.dto;

import com.trimrr.entity.Url;

import java.time.Instant;

/**
 * API shape for a link. Serializes to snake_case (original_url, short_url,
 * custom_url, created_at) to match the frontend components.
 */
public record UrlResponse(
        Long id,
        String title,
        String originalUrl,
        String shortUrl,
        String customUrl,
        String qr,
        Instant createdAt) {

    public static UrlResponse from(Url u) {
        return new UrlResponse(
                u.getId(),
                u.getTitle(),
                u.getOriginalUrl(),
                u.getShortUrl(),
                u.getCustomUrl(),
                u.getQr(),
                u.getCreatedAt());
    }
}
