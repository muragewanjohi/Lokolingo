package com.lokolingo.service.impl;

import com.lokolingo.domain.MultipleChoice;
import com.lokolingo.repository.MultipleChoiceRepository;
import com.lokolingo.service.MultipleChoiceService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link MultipleChoice}.
 */
@Service
@Transactional
public class MultipleChoiceServiceImpl implements MultipleChoiceService {

    private final Logger log = LoggerFactory.getLogger(MultipleChoiceServiceImpl.class);

    private final MultipleChoiceRepository multipleChoiceRepository;

    public MultipleChoiceServiceImpl(MultipleChoiceRepository multipleChoiceRepository) {
        this.multipleChoiceRepository = multipleChoiceRepository;
    }

    @Override
    public MultipleChoice save(MultipleChoice multipleChoice) {
        log.debug("Request to save MultipleChoice : {}", multipleChoice);
        return multipleChoiceRepository.save(multipleChoice);
    }

    @Override
    public MultipleChoice update(MultipleChoice multipleChoice) {
        log.debug("Request to update MultipleChoice : {}", multipleChoice);
        return multipleChoiceRepository.save(multipleChoice);
    }

    @Override
    public Optional<MultipleChoice> partialUpdate(MultipleChoice multipleChoice) {
        log.debug("Request to partially update MultipleChoice : {}", multipleChoice);

        return multipleChoiceRepository
            .findById(multipleChoice.getId())
            .map(existingMultipleChoice -> {
                if (multipleChoice.getStatus() != null) {
                    existingMultipleChoice.setStatus(multipleChoice.getStatus());
                }
                if (multipleChoice.getImage() != null) {
                    existingMultipleChoice.setImage(multipleChoice.getImage());
                }
                if (multipleChoice.getImageContentType() != null) {
                    existingMultipleChoice.setImageContentType(multipleChoice.getImageContentType());
                }

                return existingMultipleChoice;
            })
            .map(multipleChoiceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MultipleChoice> findAll() {
        log.debug("Request to get all MultipleChoices");
        return multipleChoiceRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MultipleChoice> findOne(Long id) {
        log.debug("Request to get MultipleChoice : {}", id);
        return multipleChoiceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete MultipleChoice : {}", id);
        multipleChoiceRepository.deleteById(id);
    }
}
