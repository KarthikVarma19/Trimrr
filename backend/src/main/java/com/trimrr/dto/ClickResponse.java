package com.trimrr.dto;

import com.trimrr.entity.Click;

import java.time.Instant;

/** API shape for a recorded click (snake_case: url_id, created_at). */
public record ClickResponse(
        Long id,
        Long urlId,
        String city,
        String country,
        String device,
        Instant createdAt) {

    public static ClickResponse from(Click c) {
        return new ClickResponse(
                c.getId(),
                c.getUrlId(),
                c.getCity(),
                c.getCountry(),
                c.getDevice(),
                c.getCreatedAt());
    }
}
