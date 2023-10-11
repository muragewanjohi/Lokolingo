package com.lokolingo.service.impl;

import com.lokolingo.domain.LessonTiles;
import com.lokolingo.repository.LessonTilesRepository;
import com.lokolingo.service.LessonTilesService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link LessonTiles}.
 */
@Service
@Transactional
public class LessonTilesServiceImpl implements LessonTilesService {

    private final Logger log = LoggerFactory.getLogger(LessonTilesServiceImpl.class);

    private final LessonTilesRepository lessonTilesRepository;

    public LessonTilesServiceImpl(LessonTilesRepository lessonTilesRepository) {
        this.lessonTilesRepository = lessonTilesRepository;
    }

    @Override
    public LessonTiles save(LessonTiles lessonTiles) {
        log.debug("Request to save LessonTiles : {}", lessonTiles);
        return lessonTilesRepository.save(lessonTiles);
    }

    @Override
    public LessonTiles update(LessonTiles lessonTiles) {
        log.debug("Request to update LessonTiles : {}", lessonTiles);
        return lessonTilesRepository.save(lessonTiles);
    }

    @Override
    public Optional<LessonTiles> partialUpdate(LessonTiles lessonTiles) {
        log.debug("Request to partially update LessonTiles : {}", lessonTiles);

        return lessonTilesRepository
            .findById(lessonTiles.getId())
            .map(existingLessonTiles -> {
                if (lessonTiles.getActive() != null) {
                    existingLessonTiles.setActive(lessonTiles.getActive());
                }
                if (lessonTiles.getCreatedAt() != null) {
                    existingLessonTiles.setCreatedAt(lessonTiles.getCreatedAt());
                }
                if (lessonTiles.getUpdatedAt() != null) {
                    existingLessonTiles.setUpdatedAt(lessonTiles.getUpdatedAt());
                }

                return existingLessonTiles;
            })
            .map(lessonTilesRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LessonTiles> findAll(Pageable pageable) {
        log.debug("Request to get all LessonTiles");
        return lessonTilesRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LessonTiles> findOne(Long id) {
        log.debug("Request to get LessonTiles : {}", id);
        return lessonTilesRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete LessonTiles : {}", id);
        lessonTilesRepository.deleteById(id);
    }
}
