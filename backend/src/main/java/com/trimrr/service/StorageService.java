package com.trimrr.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

/**
 * Uploads objects to Supabase Storage using the service-role key (which
 * bypasses storage RLS). Used to persist generated QR PNGs and return their
 * public URL.
 */
@Service
public class StorageService {

    private final RestClient restClient;
    private final String supabaseUrl;
    private final String serviceRoleKey;
    private final String qrBucket;

    public StorageService(
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${supabase.service-role-key}") String serviceRoleKey,
            @Value("${supabase.qr-bucket}") String qrBucket) {
        this.supabaseUrl = stripTrailingSlash(supabaseUrl);
        this.serviceRoleKey = serviceRoleKey;
        this.qrBucket = qrBucket;
        this.restClient = RestClient.create();
    }

    /**
     * Upload a QR PNG under the given object name and return its public URL.
     * Throws if the upload fails so link creation surfaces the error.
     */
    public String uploadQr(String objectName, byte[] png) {
        String uploadUrl = "%s/storage/v1/object/%s/%s"
                .formatted(supabaseUrl, qrBucket, objectName);

        restClient.post()
                .uri(uploadUrl)
                .header("Authorization", "Bearer " + serviceRoleKey)
                .header("apikey", serviceRoleKey)
                .header("x-upsert", "true")
                .contentType(MediaType.IMAGE_PNG)
                .body(png)
                .retrieve()
                .toBodilessEntity();

        return "%s/storage/v1/object/public/%s/%s"
                .formatted(supabaseUrl, qrBucket, objectName);
    }

    private static String stripTrailingSlash(String s) {
        return s != null && s.endsWith("/") ? s.substring(0, s.length() - 1) : s;
    }
}
