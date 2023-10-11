package com.lokolingo.repository;

import com.lokolingo.domain.Learning;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Learning entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LearningRepository extends JpaRepository<Learning, Long> {}
