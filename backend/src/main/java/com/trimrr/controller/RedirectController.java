package com.trimrr.controller;

import com.trimrr.dto.UrlTarget;
import com.trimrr.service.ClickService;
import com.trimrr.service.RedirectService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.Optional;

@RestController
public class RedirectController {

    private final RedirectService redirectService;
    private final ClickService clickService;

    public RedirectController(RedirectService redirectService, ClickService clickService) {
        this.redirectService = redirectService;
        this.clickService = clickService;
    }

    /**
     * The core redirect. Resolves the code (cache-first), fires analytics
     * asynchronously, and returns immediately.
     *
     * We return 302 (not 301) on purpose: a 301 is permanently cached by
     * browsers/CDNs, so subsequent clicks would skip our server entirely and
     * never be counted. 302 keeps every click flowing through analytics.
     */
    @GetMapping("/{code}")
    public ResponseEntity<Void> redirect(@PathVariable String code, HttpServletRequest request) {
        Optional<UrlTarget> target = redirectService.resolveOptional(code);
        if (target.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UrlTarget url = target.get();
        clickService.recordClick(url.id(), request.getHeader("User-Agent"), clientIp(request));

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(url.originalUrl()))
                .build();
    }

    /** Prefer the left-most X-Forwarded-For entry (real client behind a proxy). */
    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
