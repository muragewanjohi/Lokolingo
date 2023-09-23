package com.lokolingo.service.impl;

import com.lokolingo.domain.Learning;
import com.lokolingo.repository.LearningRepository;
import com.lokolingo.service.LearningService;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Learning}.
 */
@Service
@Transactional
public class LearningServiceImpl implements LearningService {

    private final Logger log = LoggerFactory.getLogger(LearningServiceImpl.class);

    private final LearningRepository learningRepository;

    public LearningServiceImpl(LearningRepository learningRepository) {
        this.learningRepository = learningRepository;
    }

    @Override
    public Learning save(Learning learning) {
        log.debug("Request to save Learning : {}", learning);
        return learningRepository.save(learning);
    }

    @Override
    public Learning update(Learning learning) {
        log.debug("Request to update Learning : {}", learning);
        return learningRepository.save(learning);
    }

    @Override
    public Optional<Learning> partialUpdate(Learning learning) {
        log.debug("Request to partially update Learning : {}", learning);

        return learningRepository
            .findById(learning.getId())
            .map(existingLearning -> {
                if (learning.getStartDate() != null) {
                    existingLearning.setStartDate(learning.getStartDate());
                }
                if (learning.getEndDate() != null) {
                    existingLearning.setEndDate(learning.getEndDate());
                }
                if (learning.getLanguage() != null) {
                    existingLearning.setLanguage(learning.getLanguage());
                }

                return existingLearning;
            })
            .map(learningRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Learning> findAll() {
        log.debug("Request to get all Learnings");
        return learningRepository.findAll();
    }

    /**
     *  Get all the learnings where Child is {@code null}.
     *  @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Learning> findAllWhereChildIsNull() {
        log.debug("Request to get all learnings where Child is null");
        return StreamSupport
            .stream(learningRepository.findAll().spliterator(), false)
            .filter(learning -> learning.getChild() == null)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Learning> findOne(Long id) {
        log.debug("Request to get Learning : {}", id);
        return learningRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Learning : {}", id);
        learningRepository.deleteById(id);
    }
}
