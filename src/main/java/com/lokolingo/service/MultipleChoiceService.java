package com.lokolingo.service;

import com.lokolingo.domain.MultipleChoice;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link MultipleChoice}.
 */
public interface MultipleChoiceService {
    /**
     * Save a multipleChoice.
     *
     * @param multipleChoice the entity to save.
     * @return the persisted entity.
     */
    MultipleChoice save(MultipleChoice multipleChoice);

    /**
     * Updates a multipleChoice.
     *
     * @param multipleChoice the entity to update.
     * @return the persisted entity.
     */
    MultipleChoice update(MultipleChoice multipleChoice);

    /**
     * Partially updates a multipleChoice.
     *
     * @param multipleChoice the entity to update partially.
     * @return the persisted entity.
     */
    Optional<MultipleChoice> partialUpdate(MultipleChoice multipleChoice);

    /**
     * Get all the multipleChoices.
     *
     * @return the list of entities.
     */
    List<MultipleChoice> findAll();

    /**
     * Get the "id" multipleChoice.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<MultipleChoice> findOne(Long id);

    /**
     * Delete the "id" multipleChoice.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
