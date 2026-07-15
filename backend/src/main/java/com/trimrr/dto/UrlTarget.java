package com.trimrr.dto;

/**
 * Lightweight, immutable projection cached per short code. We cache this
 * rather than the JPA entity so the cache holds no managed/proxy state and
 * only the two fields the redirect hot path actually needs.
 */
public record UrlTarget(Long id, String originalUrl) {
}
