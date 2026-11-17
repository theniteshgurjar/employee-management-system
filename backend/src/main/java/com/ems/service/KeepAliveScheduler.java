package com.ems.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Scheduled Keep-Alive Worker designed for free cloud hosting (Render, Koyeb).
 * 
 * Render Free Tier automatically sleeps services if no external HTTP traffic arrives
 * for 15 minutes. This worker wakes every 10 minutes and dispatches an HTTP request to its
 * own public external URL through the cloud provider's proxy, ensuring the service stays warm.
 */
@Service
public class KeepAliveScheduler {

    private static final Logger logger = LoggerFactory.getLogger(KeepAliveScheduler.class);

    // Automatically reads RENDER_EXTERNAL_URL injected by Render, or APP_BACKEND_URL
    @Value("${app.keep-alive.url:${RENDER_EXTERNAL_URL:${APP_BACKEND_URL:}}}")
    private String keepAliveUrl;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    /**
     * Executes every 10 minutes (600,000 ms) with an initial delay of 1 minute.
     */
    @Scheduled(fixedRate = 600000, initialDelay = 60000)
    public void pingKeepAlive() {
        if (keepAliveUrl == null || keepAliveUrl.trim().isEmpty()) {
            logger.debug("Keep-alive self-ping skipped: No external public URL configured in environment.");
            return;
        }

        String targetUrl = keepAliveUrl.trim();
        if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
            targetUrl = "https://" + targetUrl;
        }
        if (!targetUrl.endsWith("/api/health")) {
            targetUrl = targetUrl.replaceAll("/+$", "") + "/api/health";
        }

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(targetUrl))
                    .timeout(Duration.ofSeconds(15))
                    .header("User-Agent", "EMS-KeepAlive-Worker/1.0")
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            logger.info("Keep-alive self-ping dispatched to {}: HTTP {}", targetUrl, response.statusCode());
        } catch (Exception e) {
            logger.warn("Keep-alive self-ping to {} encountered notice: {}", targetUrl, e.getMessage());
        }
    }
}
