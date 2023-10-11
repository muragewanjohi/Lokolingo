package com.lokolingo.web.rest;

import com.lokolingo.domain.Learning;
import com.lokolingo.repository.LearningRepository;
import com.lokolingo.service.LearningService;
import com.lokolingo.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.lokolingo.domain.Learning}.
 */
@RestController
@RequestMapping("/api")
public class LearningResource {

    private final Logger log = LoggerFactory.getLogger(LearningResource.class);

    private static final String ENTITY_NAME = "learning";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LearningService learningService;

    private final LearningRepository learningRepository;

    public LearningResource(LearningService learningService, LearningRepository learningRepository) {
        this.learningService = learningService;
        this.learningRepository = learningRepository;
    }

    /**
     * {@code POST  /learnings} : Create a new learning.
     *
     * @param learning the learning to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new learning, or with status {@code 400 (Bad Request)} if the learning has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/learnings")
    public ResponseEntity<Learning> createLearning(@Valid @RequestBody Learning learning) throws URISyntaxException {
        log.debug("REST request to save Learning : {}", learning);
        if (learning.getId() != null) {
            throw new BadRequestAlertException("A new learning cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Learning result = learningService.save(learning);
        return ResponseEntity
            .created(new URI("/api/learnings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /learnings/:id} : Updates an existing learning.
     *
     * @param id the id of the learning to save.
     * @param learning the learning to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated learning,
     * or with status {@code 400 (Bad Request)} if the learning is not valid,
     * or with status {@code 500 (Internal Server Error)} if the learning couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/learnings/{id}")
    public ResponseEntity<Learning> updateLearning(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Learning learning
    ) throws URISyntaxException {
        log.debug("REST request to update Learning : {}, {}", id, learning);
        if (learning.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, learning.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!learningRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Learning result = learningService.update(learning);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, learning.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /learnings/:id} : Partial updates given fields of an existing learning, field will ignore if it is null
     *
     * @param id the id of the learning to save.
     * @param learning the learning to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated learning,
     * or with status {@code 400 (Bad Request)} if the learning is not valid,
     * or with status {@code 404 (Not Found)} if the learning is not found,
     * or with status {@code 500 (Internal Server Error)} if the learning couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/learnings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Learning> partialUpdateLearning(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Learning learning
    ) throws URISyntaxException {
        log.debug("REST request to partial update Learning partially : {}, {}", id, learning);
        if (learning.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, learning.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!learningRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Learning> result = learningService.partialUpdate(learning);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, learning.getId().toString())
        );
    }

    /**
     * {@code GET  /learnings} : get all the learnings.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of learnings in body.
     */
    @GetMapping("/learnings")
    public List<Learning> getAllLearnings() {
        log.debug("REST request to get all Learnings");
        return learningService.findAll();
    }

    /**
     * {@code GET  /learnings/:id} : get the "id" learning.
     *
     * @param id the id of the learning to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the learning, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/learnings/{id}")
    public ResponseEntity<Learning> getLearning(@PathVariable Long id) {
        log.debug("REST request to get Learning : {}", id);
        Optional<Learning> learning = learningService.findOne(id);
        return ResponseUtil.wrapOrNotFound(learning);
    }

    /**
     * {@code DELETE  /learnings/:id} : delete the "id" learning.
     *
     * @param id the id of the learning to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/learnings/{id}")
    public ResponseEntity<Void> deleteLearning(@PathVariable Long id) {
        log.debug("REST request to delete Learning : {}", id);
        learningService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
