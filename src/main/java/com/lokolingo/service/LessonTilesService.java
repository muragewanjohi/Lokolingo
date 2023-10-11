package com.lokolingo.service;

import com.lokolingo.domain.LessonTiles;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link LessonTiles}.
 */
public interface LessonTilesService {
    /**
     * Save a lessonTiles.
     *
     * @param lessonTiles the entity to save.
     * @return the persisted entity.
     */
    LessonTiles save(LessonTiles lessonTiles);

    /**
     * Updates a lessonTiles.
     *
     * @param lessonTiles the entity to update.
     * @return the persisted entity.
     */
    LessonTiles update(LessonTiles lessonTiles);

    /**
     * Partially updates a lessonTiles.
     *
     * @param lessonTiles the entity to update partially.
     * @return the persisted entity.
     */
    Optional<LessonTiles> partialUpdate(LessonTiles lessonTiles);

    /**
     * Get all the lessonTiles.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<LessonTiles> findAll(Pageable pageable);

    /**
     * Get the "id" lessonTiles.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<LessonTiles> findOne(Long id);

    /**
     * Delete the "id" lessonTiles.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
