package com.trimrr.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request body for creating a link. With SNAKE_CASE Jackson config the JSON
 * keys are: title, long_url, custom_url.
 */
public class CreateUrlRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Long URL is required")
    private String longUrl;

    private String customUrl;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLongUrl() {
        return longUrl;
    }

    public void setLongUrl(String longUrl) {
        this.longUrl = longUrl;
    }

    public String getCustomUrl() {
        return customUrl;
    }

    public void setCustomUrl(String customUrl) {
        this.customUrl = customUrl;
    }
}
