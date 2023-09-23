package com.lokolingo.web.rest;

import com.lokolingo.domain.Tile;
import com.lokolingo.repository.TileRepository;
import com.lokolingo.service.TileService;
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
 * REST controller for managing {@link com.lokolingo.domain.Tile}.
 */
@RestController
@RequestMapping("/api")
public class TileResource {

    private final Logger log = LoggerFactory.getLogger(TileResource.class);

    private static final String ENTITY_NAME = "tile";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TileService tileService;

    private final TileRepository tileRepository;

    public TileResource(TileService tileService, TileRepository tileRepository) {
        this.tileService = tileService;
        this.tileRepository = tileRepository;
    }

    /**
     * {@code POST  /tiles} : Create a new tile.
     *
     * @param tile the tile to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tile, or with status {@code 400 (Bad Request)} if the tile has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tiles")
    public ResponseEntity<Tile> createTile(@Valid @RequestBody Tile tile) throws URISyntaxException {
        log.debug("REST request to save Tile : {}", tile);
        if (tile.getId() != null) {
            throw new BadRequestAlertException("A new tile cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Tile result = tileService.save(tile);
        return ResponseEntity
            .created(new URI("/api/tiles/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tiles/:id} : Updates an existing tile.
     *
     * @param id the id of the tile to save.
     * @param tile the tile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tile,
     * or with status {@code 400 (Bad Request)} if the tile is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tiles/{id}")
    public ResponseEntity<Tile> updateTile(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Tile tile)
        throws URISyntaxException {
        log.debug("REST request to update Tile : {}, {}", id, tile);
        if (tile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tile.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Tile result = tileService.update(tile);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, tile.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tiles/:id} : Partial updates given fields of an existing tile, field will ignore if it is null
     *
     * @param id the id of the tile to save.
     * @param tile the tile to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tile,
     * or with status {@code 400 (Bad Request)} if the tile is not valid,
     * or with status {@code 404 (Not Found)} if the tile is not found,
     * or with status {@code 500 (Internal Server Error)} if the tile couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tiles/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Tile> partialUpdateTile(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Tile tile
    ) throws URISyntaxException {
        log.debug("REST request to partial update Tile partially : {}, {}", id, tile);
        if (tile.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tile.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Tile> result = tileService.partialUpdate(tile);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, tile.getId().toString())
        );
    }

    /**
     * {@code GET  /tiles} : get all the tiles.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tiles in body.
     */
    @GetMapping("/tiles")
    public List<Tile> getAllTiles() {
        log.debug("REST request to get all Tiles");
        return tileService.findAll();
    }

    /**
     * {@code GET  /tiles/:id} : get the "id" tile.
     *
     * @param id the id of the tile to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tile, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tiles/{id}")
    public ResponseEntity<Tile> getTile(@PathVariable Long id) {
        log.debug("REST request to get Tile : {}", id);
        Optional<Tile> tile = tileService.findOne(id);
        return ResponseUtil.wrapOrNotFound(tile);
    }

    /**
     * {@code DELETE  /tiles/:id} : delete the "id" tile.
     *
     * @param id the id of the tile to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tiles/{id}")
    public ResponseEntity<Void> deleteTile(@PathVariable Long id) {
        log.debug("REST request to delete Tile : {}", id);
        tileService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
