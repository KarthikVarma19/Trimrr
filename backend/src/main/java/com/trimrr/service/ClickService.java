package com.trimrr.service;

import com.trimrr.entity.Click;
import com.trimrr.repository.ClickRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Records analytics for a click. This runs on a separate thread pool (@Async)
 * so the geo lookup and DB insert never add latency to the redirect the user
 * is waiting on. This is the key architectural fix versus the old client-side
 * flow, which blocked the redirect on a third-party geo API call.
 */
@Service
public class ClickService {

    private static final Logger log = LoggerFactory.getLogger(ClickService.class);

    private final ClickRepository clickRepository;
    private final RestClient restClient = RestClient.create();

    public ClickService(ClickRepository clickRepository) {
        this.clickRepository = clickRepository;
    }

    @Async("analyticsExecutor")
    public void recordClick(Long urlId, String userAgent, String ip) {
        try {
            Click click = new Click();
            click.setUrlId(urlId);
            click.setDevice(detectDevice(userAgent));

            Geo geo = lookupGeo(ip);
            click.setCity(geo.city());
            click.setCountry(geo.country());

            clickRepository.save(click);
        } catch (Exception e) {
            // Analytics must never break the product. Swallow + log.
            log.warn("Failed to record click for urlId={}: {}", urlId, e.getMessage());
        }
    }

    private String detectDevice(String userAgent) {
        if (userAgent == null) return "desktop";
        String ua = userAgent.toLowerCase();
        if (ua.contains("tablet") || ua.contains("ipad")) return "tablet";
        if (ua.contains("mobi") || ua.contains("android") || ua.contains("iphone")) return "mobile";
        return "desktop";
    }

    /**
     * Server-side geo lookup, off the redirect hot path. Uses a free,
     * key-less endpoint; any failure degrades gracefully to null geo.
     */
    @SuppressWarnings("unchecked")
    private Geo lookupGeo(String ip) {
        // For a real public IP, geolocate it directly. For local/private IPs
        // (i.e. during local development) fall back to querying ip-api with no
        // IP, which returns THIS server's public-IP location — so link clicks
        // still show a real city while developing instead of "null".
        boolean local = ip == null || ip.isBlank() || isLocal(ip);
        String uri = local
                ? "http://ip-api.com/json/?fields=status,city,country"
                : "http://ip-api.com/json/" + ip + "?fields=status,city,country";
        try {
            Map<String, Object> res = restClient.get()
                    .uri(uri)
                    .retrieve()
                    .body(Map.class);
            if (res != null && "success".equals(res.get("status"))) {
                return new Geo((String) res.get("city"), (String) res.get("country"));
            }
        } catch (Exception e) {
            log.debug("Geo lookup failed for ip={}: {}", ip, e.getMessage());
        }
        return new Geo(null, null);
    }

    private boolean isLocal(String ip) {
        return ip.startsWith("127.") || ip.startsWith("192.168.")
                || ip.startsWith("10.") || "0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip);
    }

    private record Geo(String city, String country) {
    }

    // --- Analytics reads (used by the dashboard + link detail page) ---

    public List<Click> forUrl(Long urlId) {
        return clickRepository.findByUrlId(urlId);
    }

    public List<Click> forUrls(List<Long> urlIds) {
        if (urlIds == null || urlIds.isEmpty()) {
            return List.of();
        }
        return clickRepository.findByUrlIdIn(urlIds);
    }
}
