package com.lokolingo.service.impl;

import com.lokolingo.domain.Subject;
import com.lokolingo.repository.SubjectRepository;
import com.lokolingo.service.SubjectService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Subject}.
 */
@Service
@Transactional
public class SubjectServiceImpl implements SubjectService {

    private final Logger log = LoggerFactory.getLogger(SubjectServiceImpl.class);

    private final SubjectRepository subjectRepository;

    public SubjectServiceImpl(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Override
    public Subject save(Subject subject) {
        log.debug("Request to save Subject : {}", subject);
        return subjectRepository.save(subject);
    }

    @Override
    public Subject update(Subject subject) {
        log.debug("Request to update Subject : {}", subject);
        return subjectRepository.save(subject);
    }

    @Override
    public Optional<Subject> partialUpdate(Subject subject) {
        log.debug("Request to partially update Subject : {}", subject);

        return subjectRepository
            .findById(subject.getId())
            .map(existingSubject -> {
                if (subject.getAge() != null) {
                    existingSubject.setAge(subject.getAge());
                }
                if (subject.getLanguage() != null) {
                    existingSubject.setLanguage(subject.getLanguage());
                }
                if (subject.getTitle() != null) {
                    existingSubject.setTitle(subject.getTitle());
                }

                return existingSubject;
            })
            .map(subjectRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Subject> findAll(Pageable pageable) {
        log.debug("Request to get all Subjects");
        return subjectRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Subject> findOne(Long id) {
        log.debug("Request to get Subject : {}", id);
        return subjectRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Subject : {}", id);
        subjectRepository.deleteById(id);
    }
}
