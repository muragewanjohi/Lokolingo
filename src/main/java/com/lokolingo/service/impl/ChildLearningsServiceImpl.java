package com.lokolingo.service.impl;

import com.lokolingo.domain.ChildLearnings;
import com.lokolingo.repository.ChildLearningsRepository;
import com.lokolingo.service.ChildLearningsService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link ChildLearnings}.
 */
@Service
@Transactional
public class ChildLearningsServiceImpl implements ChildLearningsService {

    private final Logger log = LoggerFactory.getLogger(ChildLearningsServiceImpl.class);

    private final ChildLearningsRepository childLearningsRepository;

    public ChildLearningsServiceImpl(ChildLearningsRepository childLearningsRepository) {
        this.childLearningsRepository = childLearningsRepository;
    }

    @Override
    public ChildLearnings save(ChildLearnings childLearnings) {
        log.debug("Request to save ChildLearnings : {}", childLearnings);
        return childLearningsRepository.save(childLearnings);
    }

    @Override
    public ChildLearnings update(ChildLearnings childLearnings) {
        log.debug("Request to update ChildLearnings : {}", childLearnings);
        return childLearningsRepository.save(childLearnings);
    }

    @Override
    public Optional<ChildLearnings> partialUpdate(ChildLearnings childLearnings) {
        log.debug("Request to partially update ChildLearnings : {}", childLearnings);

        return childLearningsRepository
            .findById(childLearnings.getId())
            .map(existingChildLearnings -> {
                if (childLearnings.getActive() != null) {
                    existingChildLearnings.setActive(childLearnings.getActive());
                }
                if (childLearnings.getCreatedAt() != null) {
                    existingChildLearnings.setCreatedAt(childLearnings.getCreatedAt());
                }
                if (childLearnings.getUpdatedAt() != null) {
                    existingChildLearnings.setUpdatedAt(childLearnings.getUpdatedAt());
                }

                return existingChildLearnings;
            })
            .map(childLearningsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ChildLearnings> findAll(Pageable pageable) {
        log.debug("Request to get all ChildLearnings");
        return childLearningsRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ChildLearnings> findOne(Long id) {
        log.debug("Request to get ChildLearnings : {}", id);
        return childLearningsRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete ChildLearnings : {}", id);
        childLearningsRepository.deleteById(id);
    }
}
