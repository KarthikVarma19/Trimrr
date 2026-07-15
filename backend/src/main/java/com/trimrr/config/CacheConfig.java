package com.trimrr.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class CacheConfig {

    /**
     * In-memory cache for resolved short codes. A short TTL bounds staleness
     * if a URL is edited/deleted; max size bounds memory. For multi-instance
     * deployments this would move to Redis, but Caffeine is the right choice
     * for a single always-on node.
     */
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager("urls");
        manager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(10_000)
                .expireAfterWrite(Duration.ofMinutes(10))
                .recordStats());
        return manager;
    }
}
