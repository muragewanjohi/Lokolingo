package com.lokolingo.web.rest;

import com.lokolingo.domain.LessonTiles;
import com.lokolingo.repository.LessonTilesRepository;
import com.lokolingo.service.LessonTilesService;
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
 * REST controller for managing {@link com.lokolingo.domain.LessonTiles}.
 */
@RestController
@RequestMapping("/api")
public class LessonTilesResource {

    private final Logger log = LoggerFactory.getLogger(LessonTilesResource.class);

    private static final String ENTITY_NAME = "lessonTiles";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LessonTilesService lessonTilesService;

    private final LessonTilesRepository lessonTilesRepository;

    public LessonTilesResource(LessonTilesService lessonTilesService, LessonTilesRepository lessonTilesRepository) {
        this.lessonTilesService = lessonTilesService;
        this.lessonTilesRepository = lessonTilesRepository;
    }

    /**
     * {@code POST  /lesson-tiles} : Create a new lessonTiles.
     *
     * @param lessonTiles the lessonTiles to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lessonTiles, or with status {@code 400 (Bad Request)} if the lessonTiles has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/lesson-tiles")
    public ResponseEntity<LessonTiles> createLessonTiles(@RequestBody LessonTiles lessonTiles) throws URISyntaxException {
        log.debug("REST request to save LessonTiles : {}", lessonTiles);
        if (lessonTiles.getId() != null) {
            throw new BadRequestAlertException("A new lessonTiles cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LessonTiles result = lessonTilesService.save(lessonTiles);
        return ResponseEntity
            .created(new URI("/api/lesson-tiles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /lesson-tiles/:id} : Updates an existing lessonTiles.
     *
     * @param id the id of the lessonTiles to save.
     * @param lessonTiles the lessonTiles to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lessonTiles,
     * or with status {@code 400 (Bad Request)} if the lessonTiles is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lessonTiles couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/lesson-tiles/{id}")
    public ResponseEntity<LessonTiles> updateLessonTiles(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LessonTiles lessonTiles
    ) throws URISyntaxException {
        log.debug("REST request to update LessonTiles : {}, {}", id, lessonTiles);
        if (lessonTiles.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lessonTiles.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lessonTilesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LessonTiles result = lessonTilesService.update(lessonTiles);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, lessonTiles.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /lesson-tiles/:id} : Partial updates given fields of an existing lessonTiles, field will ignore if it is null
     *
     * @param id the id of the lessonTiles to save.
     * @param lessonTiles the lessonTiles to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lessonTiles,
     * or with status {@code 400 (Bad Request)} if the lessonTiles is not valid,
     * or with status {@code 404 (Not Found)} if the lessonTiles is not found,
     * or with status {@code 500 (Internal Server Error)} if the lessonTiles couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/lesson-tiles/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LessonTiles> partialUpdateLessonTiles(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LessonTiles lessonTiles
    ) throws URISyntaxException {
        log.debug("REST request to partial update LessonTiles partially : {}, {}", id, lessonTiles);
        if (lessonTiles.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, lessonTiles.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lessonTilesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LessonTiles> result = lessonTilesService.partialUpdate(lessonTiles);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, lessonTiles.getId().toString())
        );
    }

    /**
     * {@code GET  /lesson-tiles} : get all the lessonTiles.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lessonTiles in body.
     */
    @GetMapping("/lesson-tiles")
    public ResponseEntity<List<LessonTiles>> getAllLessonTiles(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of LessonTiles");
        Page<LessonTiles> page = lessonTilesService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /lesson-tiles/:id} : get the "id" lessonTiles.
     *
     * @param id the id of the lessonTiles to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lessonTiles, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/lesson-tiles/{id}")
    public ResponseEntity<LessonTiles> getLessonTiles(@PathVariable Long id) {
        log.debug("REST request to get LessonTiles : {}", id);
        Optional<LessonTiles> lessonTiles = lessonTilesService.findOne(id);
        return ResponseUtil.wrapOrNotFound(lessonTiles);
    }

    /**
     * {@code DELETE  /lesson-tiles/:id} : delete the "id" lessonTiles.
     *
     * @param id the id of the lessonTiles to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/lesson-tiles/{id}")
    public ResponseEntity<Void> deleteLessonTiles(@PathVariable Long id) {
        log.debug("REST request to delete LessonTiles : {}", id);
        lessonTilesService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
