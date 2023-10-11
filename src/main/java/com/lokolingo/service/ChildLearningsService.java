package com.lokolingo.service;

import com.lokolingo.domain.ChildLearnings;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link ChildLearnings}.
 */
public interface ChildLearningsService {
    /**
     * Save a childLearnings.
     *
     * @param childLearnings the entity to save.
     * @return the persisted entity.
     */
    ChildLearnings save(ChildLearnings childLearnings);

    /**
     * Updates a childLearnings.
     *
     * @param childLearnings the entity to update.
     * @return the persisted entity.
     */
    ChildLearnings update(ChildLearnings childLearnings);

    /**
     * Partially updates a childLearnings.
     *
     * @param childLearnings the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ChildLearnings> partialUpdate(ChildLearnings childLearnings);

    /**
     * Get all the childLearnings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<ChildLearnings> findAll(Pageable pageable);

    /**
     * Get the "id" childLearnings.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ChildLearnings> findOne(Long id);

    /**
     * Delete the "id" childLearnings.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
