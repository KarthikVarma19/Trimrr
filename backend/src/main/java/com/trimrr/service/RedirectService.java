package com.trimrr.service;

import com.trimrr.dto.UrlTarget;
import com.trimrr.repository.UrlRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RedirectService {

    private final UrlRepository urlRepository;

    public RedirectService(UrlRepository urlRepository) {
        this.urlRepository = urlRepository;
    }

    /**
     * Resolve a short code to its target. Results are cached in Caffeine
     * ("urls" cache) so hot links never hit Postgres after the first lookup.
     * `unless = "#result == null"` keeps cache misses out of the cache, so a
     * flood of bogus codes can't evict real entries or bloat memory.
     */
    @Cacheable(value = "urls", key = "#code", unless = "#result == null")
    public UrlTarget resolve(String code) {
        return urlRepository.findByCode(code)
                .map(u -> new UrlTarget(u.getId(), u.getOriginalUrl()))
                .orElse(null);
    }

    public Optional<UrlTarget> resolveOptional(String code) {
        return Optional.ofNullable(resolve(code));
    }
}
