package com.lokolingo.service;

import com.lokolingo.domain.SubjectLessons;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link SubjectLessons}.
 */
public interface SubjectLessonsService {
    /**
     * Save a subjectLessons.
     *
     * @param subjectLessons the entity to save.
     * @return the persisted entity.
     */
    SubjectLessons save(SubjectLessons subjectLessons);

    /**
     * Updates a subjectLessons.
     *
     * @param subjectLessons the entity to update.
     * @return the persisted entity.
     */
    SubjectLessons update(SubjectLessons subjectLessons);

    /**
     * Partially updates a subjectLessons.
     *
     * @param subjectLessons the entity to update partially.
     * @return the persisted entity.
     */
    Optional<SubjectLessons> partialUpdate(SubjectLessons subjectLessons);

    /**
     * Get all the subjectLessons.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<SubjectLessons> findAll(Pageable pageable);

    /**
     * Get the "id" subjectLessons.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<SubjectLessons> findOne(Long id);

    /**
     * Delete the "id" subjectLessons.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
