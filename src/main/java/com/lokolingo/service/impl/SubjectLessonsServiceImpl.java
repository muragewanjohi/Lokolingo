package com.lokolingo.service.impl;

import com.lokolingo.domain.SubjectLessons;
import com.lokolingo.repository.SubjectLessonsRepository;
import com.lokolingo.service.SubjectLessonsService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link SubjectLessons}.
 */
@Service
@Transactional
public class SubjectLessonsServiceImpl implements SubjectLessonsService {

    private final Logger log = LoggerFactory.getLogger(SubjectLessonsServiceImpl.class);

    private final SubjectLessonsRepository subjectLessonsRepository;

    public SubjectLessonsServiceImpl(SubjectLessonsRepository subjectLessonsRepository) {
        this.subjectLessonsRepository = subjectLessonsRepository;
    }

    @Override
    public SubjectLessons save(SubjectLessons subjectLessons) {
        log.debug("Request to save SubjectLessons : {}", subjectLessons);
        return subjectLessonsRepository.save(subjectLessons);
    }

    @Override
    public SubjectLessons update(SubjectLessons subjectLessons) {
        log.debug("Request to update SubjectLessons : {}", subjectLessons);
        return subjectLessonsRepository.save(subjectLessons);
    }

    @Override
    public Optional<SubjectLessons> partialUpdate(SubjectLessons subjectLessons) {
        log.debug("Request to partially update SubjectLessons : {}", subjectLessons);

        return subjectLessonsRepository
            .findById(subjectLessons.getId())
            .map(existingSubjectLessons -> {
                if (subjectLessons.getActive() != null) {
                    existingSubjectLessons.setActive(subjectLessons.getActive());
                }
                if (subjectLessons.getCreatedAt() != null) {
                    existingSubjectLessons.setCreatedAt(subjectLessons.getCreatedAt());
                }
                if (subjectLessons.getUpdatedAt() != null) {
                    existingSubjectLessons.setUpdatedAt(subjectLessons.getUpdatedAt());
                }

                return existingSubjectLessons;
            })
            .map(subjectLessonsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SubjectLessons> findAll(Pageable pageable) {
        log.debug("Request to get all SubjectLessons");
        return subjectLessonsRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SubjectLessons> findOne(Long id) {
        log.debug("Request to get SubjectLessons : {}", id);
        return subjectLessonsRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete SubjectLessons : {}", id);
        subjectLessonsRepository.deleteById(id);
    }
}
