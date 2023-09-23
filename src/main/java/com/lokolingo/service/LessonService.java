package com.lokolingo.service;

import com.lokolingo.domain.Lesson;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Lesson}.
 */
public interface LessonService {
    /**
     * Save a lesson.
     *
     * @param lesson the entity to save.
     * @return the persisted entity.
     */
    Lesson save(Lesson lesson);

    /**
     * Updates a lesson.
     *
     * @param lesson the entity to update.
     * @return the persisted entity.
     */
    Lesson update(Lesson lesson);

    /**
     * Partially updates a lesson.
     *
     * @param lesson the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Lesson> partialUpdate(Lesson lesson);

    /**
     * Get all the lessons.
     *
     * @return the list of entities.
     */
    List<Lesson> findAll();

    /**
     * Get the "id" lesson.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Lesson> findOne(Long id);

    /**
     * Delete the "id" lesson.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
