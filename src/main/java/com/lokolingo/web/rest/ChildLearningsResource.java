package com.lokolingo.web.rest;

import com.lokolingo.domain.ChildLearnings;
import com.lokolingo.repository.ChildLearningsRepository;
import com.lokolingo.service.ChildLearningsService;
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
 * REST controller for managing {@link com.lokolingo.domain.ChildLearnings}.
 */
@RestController
@RequestMapping("/api")
public class ChildLearningsResource {

    private final Logger log = LoggerFactory.getLogger(ChildLearningsResource.class);

    private static final String ENTITY_NAME = "childLearnings";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChildLearningsService childLearningsService;

    private final ChildLearningsRepository childLearningsRepository;

    public ChildLearningsResource(ChildLearningsService childLearningsService, ChildLearningsRepository childLearningsRepository) {
        this.childLearningsService = childLearningsService;
        this.childLearningsRepository = childLearningsRepository;
    }

    /**
     * {@code POST  /child-learnings} : Create a new childLearnings.
     *
     * @param childLearnings the childLearnings to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new childLearnings, or with status {@code 400 (Bad Request)} if the childLearnings has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/child-learnings")
    public ResponseEntity<ChildLearnings> createChildLearnings(@RequestBody ChildLearnings childLearnings) throws URISyntaxException {
        log.debug("REST request to save ChildLearnings : {}", childLearnings);
        if (childLearnings.getId() != null) {
            throw new BadRequestAlertException("A new childLearnings cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChildLearnings result = childLearningsService.save(childLearnings);
        return ResponseEntity
            .created(new URI("/api/child-learnings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /child-learnings/:id} : Updates an existing childLearnings.
     *
     * @param id the id of the childLearnings to save.
     * @param childLearnings the childLearnings to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated childLearnings,
     * or with status {@code 400 (Bad Request)} if the childLearnings is not valid,
     * or with status {@code 500 (Internal Server Error)} if the childLearnings couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/child-learnings/{id}")
    public ResponseEntity<ChildLearnings> updateChildLearnings(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChildLearnings childLearnings
    ) throws URISyntaxException {
        log.debug("REST request to update ChildLearnings : {}, {}", id, childLearnings);
        if (childLearnings.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, childLearnings.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!childLearningsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ChildLearnings result = childLearningsService.update(childLearnings);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, childLearnings.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /child-learnings/:id} : Partial updates given fields of an existing childLearnings, field will ignore if it is null
     *
     * @param id the id of the childLearnings to save.
     * @param childLearnings the childLearnings to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated childLearnings,
     * or with status {@code 400 (Bad Request)} if the childLearnings is not valid,
     * or with status {@code 404 (Not Found)} if the childLearnings is not found,
     * or with status {@code 500 (Internal Server Error)} if the childLearnings couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/child-learnings/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ChildLearnings> partialUpdateChildLearnings(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody ChildLearnings childLearnings
    ) throws URISyntaxException {
        log.debug("REST request to partial update ChildLearnings partially : {}, {}", id, childLearnings);
        if (childLearnings.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, childLearnings.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!childLearningsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ChildLearnings> result = childLearningsService.partialUpdate(childLearnings);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, childLearnings.getId().toString())
        );
    }

    /**
     * {@code GET  /child-learnings} : get all the childLearnings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of childLearnings in body.
     */
    @GetMapping("/child-learnings")
    public ResponseEntity<List<ChildLearnings>> getAllChildLearnings(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of ChildLearnings");
        Page<ChildLearnings> page = childLearningsService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /child-learnings/:id} : get the "id" childLearnings.
     *
     * @param id the id of the childLearnings to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the childLearnings, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/child-learnings/{id}")
    public ResponseEntity<ChildLearnings> getChildLearnings(@PathVariable Long id) {
        log.debug("REST request to get ChildLearnings : {}", id);
        Optional<ChildLearnings> childLearnings = childLearningsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(childLearnings);
    }

    /**
     * {@code DELETE  /child-learnings/:id} : delete the "id" childLearnings.
     *
     * @param id the id of the childLearnings to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/child-learnings/{id}")
    public ResponseEntity<Void> deleteChildLearnings(@PathVariable Long id) {
        log.debug("REST request to delete ChildLearnings : {}", id);
        childLearningsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
