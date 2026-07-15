package com.trimrr.repository;

import com.trimrr.entity.Click;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClickRepository extends JpaRepository<Click, Long> {

    List<Click> findByUrlId(Long urlId);

    List<Click> findByUrlIdIn(List<Long> urlIds);
}
