package com.trimrr.controller;

import com.trimrr.dto.ClickResponse;
import com.trimrr.entity.Url;
import com.trimrr.service.ClickService;
import com.trimrr.service.UrlService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * Aggregate analytics across all of the caller's links — used by the dashboard
 * to show total clicks.
 */
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final UrlService urlService;
    private final ClickService clickService;

    public AnalyticsController(UrlService urlService, ClickService clickService) {
        this.urlService = urlService;
        this.clickService = clickService;
    }

    @GetMapping("/clicks")
    public List<ClickResponse> allClicks(@AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        List<Long> urlIds = urlService.listForUser(userId).stream()
                .map(Url::getId)
                .toList();
        return clickService.forUrls(urlIds).stream()
                .map(ClickResponse::from)
                .toList();
    }
}
