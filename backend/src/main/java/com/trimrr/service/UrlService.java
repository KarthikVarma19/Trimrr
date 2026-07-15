package com.trimrr.service;

import com.trimrr.dto.CreateUrlRequest;
import com.trimrr.entity.Url;
import com.trimrr.repository.UrlRepository;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;

@Service
public class UrlService {

    // URL-safe alphabet without look-alike chars (0/O, 1/l/I), matching the
    // frontend generator so codes read cleanly.
    private static final String ALPHABET =
            "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final int CODE_LENGTH = 7;
    private static final int MAX_ATTEMPTS = 5;

    private final UrlRepository urlRepository;
    private final QrService qrService;
    private final StorageService storageService;
    private final CacheManager cacheManager;
    private final SecureRandom random = new SecureRandom();

    public UrlService(
            UrlRepository urlRepository,
            QrService qrService,
            StorageService storageService,
            CacheManager cacheManager) {
        this.urlRepository = urlRepository;
        this.qrService = qrService;
        this.storageService = storageService;
        this.cacheManager = cacheManager;
    }

    public List<Url> listForUser(UUID userId) {
        return urlRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Url getForUser(Long id, UUID userId) {
        return urlRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Link not found"));
    }

    public Url create(CreateUrlRequest req, UUID userId) {
        String customUrl = normalize(req.getCustomUrl());
        if (customUrl != null && urlRepository.findByCode(customUrl).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "That custom link is already taken");
        }

        String shortUrl = generateUniqueShortCode();

        String qrUrl;
        try {
            byte[] png = qrService.generatePng(req.getLongUrl());
            qrUrl = storageService.uploadQr("qr-" + shortUrl + ".png", png);
        } catch (Exception e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY, "Failed to generate QR code", e);
        }

        Url url = new Url();
        url.setTitle(req.getTitle());
        url.setOriginalUrl(req.getLongUrl());
        url.setCustomUrl(customUrl);
        url.setShortUrl(shortUrl);
        url.setUserId(userId);
        url.setQr(qrUrl);

        return urlRepository.save(url);
    }

    public void delete(Long id, UUID userId) {
        Url url = getForUser(id, userId);
        urlRepository.delete(url);
        // Keep the redirect cache from serving a deleted link.
        evictFromCache(url.getShortUrl());
        evictFromCache(url.getCustomUrl());
    }

    private String generateUniqueShortCode() {
        for (int attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            String code = randomCode();
            if (urlRepository.findByCode(code).isEmpty()) {
                return code;
            }
        }
        throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not generate a unique short url, please try again");
    }

    private String randomCode() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }

    private void evictFromCache(String code) {
        if (code == null) return;
        Cache cache = cacheManager.getCache("urls");
        if (cache != null) cache.evict(code);
    }

    private static String normalize(String s) {
        if (s == null) return null;
        String trimmed = s.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
