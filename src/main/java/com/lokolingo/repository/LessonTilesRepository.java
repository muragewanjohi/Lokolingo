package com.lokolingo.repository;

import com.lokolingo.domain.LessonTiles;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LessonTiles entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LessonTilesRepository extends JpaRepository<LessonTiles, Long> {}
