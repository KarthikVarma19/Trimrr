package com.trimrr.repository;

import com.trimrr.entity.Url;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UrlRepository extends JpaRepository<Url, Long> {

    /**
     * Resolve a short code that may be either a generated short_url or a
     * user-chosen custom_url. Mirrors the frontend's original OR lookup.
     */
    @Query("SELECT u FROM Url u WHERE u.shortUrl = :code OR u.customUrl = :code")
    Optional<Url> findByCode(@Param("code") String code);

    List<Url> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<Url> findByIdAndUserId(Long id, UUID userId);
}
