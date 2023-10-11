package com.lokolingo.service;

import com.lokolingo.domain.Learning;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Learning}.
 */
public interface LearningService {
    /**
     * Save a learning.
     *
     * @param learning the entity to save.
     * @return the persisted entity.
     */
    Learning save(Learning learning);

    /**
     * Updates a learning.
     *
     * @param learning the entity to update.
     * @return the persisted entity.
     */
    Learning update(Learning learning);

    /**
     * Partially updates a learning.
     *
     * @param learning the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Learning> partialUpdate(Learning learning);

    /**
     * Get all the learnings.
     *
     * @return the list of entities.
     */
    List<Learning> findAll();

    /**
     * Get the "id" learning.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Learning> findOne(Long id);

    /**
     * Delete the "id" learning.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
