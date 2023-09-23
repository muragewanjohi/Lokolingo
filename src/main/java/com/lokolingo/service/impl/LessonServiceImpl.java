package com.lokolingo.service.impl;

import com.lokolingo.domain.Lesson;
import com.lokolingo.repository.LessonRepository;
import com.lokolingo.service.LessonService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Lesson}.
 */
@Service
@Transactional
public class LessonServiceImpl implements LessonService {

    private final Logger log = LoggerFactory.getLogger(LessonServiceImpl.class);

    private final LessonRepository lessonRepository;

    public LessonServiceImpl(LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    @Override
    public Lesson save(Lesson lesson) {
        log.debug("Request to save Lesson : {}", lesson);
        return lessonRepository.save(lesson);
    }

    @Override
    public Lesson update(Lesson lesson) {
        log.debug("Request to update Lesson : {}", lesson);
        return lessonRepository.save(lesson);
    }

    @Override
    public Optional<Lesson> partialUpdate(Lesson lesson) {
        log.debug("Request to partially update Lesson : {}", lesson);

        return lessonRepository
            .findById(lesson.getId())
            .map(existingLesson -> {
                if (lesson.getTitle() != null) {
                    existingLesson.setTitle(lesson.getTitle());
                }
                if (lesson.getLanguage() != null) {
                    existingLesson.setLanguage(lesson.getLanguage());
                }
                if (lesson.getLevel() != null) {
                    existingLesson.setLevel(lesson.getLevel());
                }

                return existingLesson;
            })
            .map(lessonRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Lesson> findAll() {
        log.debug("Request to get all Lessons");
        return lessonRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Lesson> findOne(Long id) {
        log.debug("Request to get Lesson : {}", id);
        return lessonRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Lesson : {}", id);
        lessonRepository.deleteById(id);
    }
}
