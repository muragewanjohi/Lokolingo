package com.lokolingo.web.rest;

import com.lokolingo.domain.SubjectLessons;
import com.lokolingo.repository.SubjectLessonsRepository;
import com.lokolingo.service.SubjectLessonsService;
import com.lokolingo.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.lokolingo.domain.SubjectLessons}.
 */
@RestController
@RequestMapping("/api")
public class SubjectLessonsResource {

    private final Logger log = LoggerFactory.getLogger(SubjectLessonsResource.class);

    private static final String ENTITY_NAME = "subjectLessons";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SubjectLessonsService subjectLessonsService;

    private final SubjectLessonsRepository subjectLessonsRepository;

    public SubjectLessonsResource(SubjectLessonsService subjectLessonsService, SubjectLessonsRepository subjectLessonsRepository) {
        this.subjectLessonsService = subjectLessonsService;
        this.subjectLessonsRepository = subjectLessonsRepository;
    }

    /**
     * {@code POST  /subject-lessons} : Create a new subjectLessons.
     *
     * @param subjectLessons the subjectLessons to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new subjectLessons, or with status {@code 400 (Bad Request)} if the subjectLessons has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/subject-lessons")
    public ResponseEntity<SubjectLessons> createSubjectLessons(@RequestBody SubjectLessons subjectLessons) throws URISyntaxException {
        log.debug("REST request to save SubjectLessons : {}", subjectLessons);
        if (subjectLessons.getId() != null) {
            throw new BadRequestAlertException("A new subjectLessons cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SubjectLessons result = subjectLessonsService.save(subjectLessons);
        return ResponseEntity
            .created(new URI("/api/subject-lessons/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /subject-lessons/:id} : Updates an existing subjectLessons.
     *
     * @param id the id of the subjectLessons to save.
     * @param subjectLessons the subjectLessons to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated subjectLessons,
     * or with status {@code 400 (Bad Request)} if the subjectLessons is not valid,
     * or with status {@code 500 (Internal Server Error)} if the subjectLessons couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/subject-lessons/{id}")
    public ResponseEntity<SubjectLessons> updateSubjectLessons(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SubjectLessons subjectLessons
    ) throws URISyntaxException {
        log.debug("REST request to update SubjectLessons : {}, {}", id, subjectLessons);
        if (subjectLessons.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, subjectLessons.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!subjectLessonsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SubjectLessons result = subjectLessonsService.update(subjectLessons);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, subjectLessons.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /subject-lessons/:id} : Partial updates given fields of an existing subjectLessons, field will ignore if it is null
     *
     * @param id the id of the subjectLessons to save.
     * @param subjectLessons the subjectLessons to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated subjectLessons,
     * or with status {@code 400 (Bad Request)} if the subjectLessons is not valid,
     * or with status {@code 404 (Not Found)} if the subjectLessons is not found,
     * or with status {@code 500 (Internal Server Error)} if the subjectLessons couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/subject-lessons/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SubjectLessons> partialUpdateSubjectLessons(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SubjectLessons subjectLessons
    ) throws URISyntaxException {
        log.debug("REST request to partial update SubjectLessons partially : {}, {}", id, subjectLessons);
        if (subjectLessons.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, subjectLessons.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!subjectLessonsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SubjectLessons> result = subjectLessonsService.partialUpdate(subjectLessons);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, subjectLessons.getId().toString())
        );
    }

    /**
     * {@code GET  /subject-lessons} : get all the subjectLessons.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of subjectLessons in body.
     */
    @GetMapping("/subject-lessons")
    public ResponseEntity<List<SubjectLessons>> getAllSubjectLessons(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of SubjectLessons");
        Page<SubjectLessons> page = subjectLessonsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /subject-lessons/:id} : get the "id" subjectLessons.
     *
     * @param id the id of the subjectLessons to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the subjectLessons, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/subject-lessons/{id}")
    public ResponseEntity<SubjectLessons> getSubjectLessons(@PathVariable Long id) {
        log.debug("REST request to get SubjectLessons : {}", id);
        Optional<SubjectLessons> subjectLessons = subjectLessonsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(subjectLessons);
    }

    /**
     * {@code DELETE  /subject-lessons/:id} : delete the "id" subjectLessons.
     *
     * @param id the id of the subjectLessons to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/subject-lessons/{id}")
    public ResponseEntity<Void> deleteSubjectLessons(@PathVariable Long id) {
        log.debug("REST request to delete SubjectLessons : {}", id);
        subjectLessonsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
