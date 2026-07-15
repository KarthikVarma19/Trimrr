package com.trimrr.controller;

import com.trimrr.dto.ClickResponse;
import com.trimrr.dto.CreateUrlRequest;
import com.trimrr.dto.UrlResponse;
import com.trimrr.entity.Url;
import com.trimrr.service.ClickService;
import com.trimrr.service.UrlService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

/**
 * Authenticated URL management. Every method scopes to the user identified by
 * the Supabase JWT `sub` claim, so users can only see and touch their own
 * links — this is the role/ownership enforcement done server-side.
 */
@RestController
@RequestMapping("/api/urls")
public class UrlController {

    private final UrlService urlService;
    private final ClickService clickService;

    public UrlController(UrlService urlService, ClickService clickService) {
        this.urlService = urlService;
        this.clickService = clickService;
    }

    @GetMapping
    public List<UrlResponse> list(@AuthenticationPrincipal Jwt jwt) {
        return urlService.listForUser(userId(jwt)).stream()
                .map(UrlResponse::from)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UrlResponse create(
            @Valid @RequestBody CreateUrlRequest req,
            @AuthenticationPrincipal Jwt jwt) {
        Url created = urlService.create(req, userId(jwt));
        return UrlResponse.from(created);
    }

    @GetMapping("/{id}")
    public UrlResponse get(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return UrlResponse.from(urlService.getForUser(id, userId(jwt)));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        urlService.delete(id, userId(jwt));
    }

    @GetMapping("/{id}/clicks")
    public List<ClickResponse> clicks(
            @PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        // Ownership check first — 404s if the link isn't the caller's.
        urlService.getForUser(id, userId(jwt));
        return clickService.forUrl(id).stream().map(ClickResponse::from).toList();
    }

    private UUID userId(Jwt jwt) {
        return UUID.fromString(jwt.getSubject());
    }
}
