package com.lokolingo.service;

import com.lokolingo.domain.Tile;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Tile}.
 */
public interface TileService {
    /**
     * Save a tile.
     *
     * @param tile the entity to save.
     * @return the persisted entity.
     */
    Tile save(Tile tile);

    /**
     * Updates a tile.
     *
     * @param tile the entity to update.
     * @return the persisted entity.
     */
    Tile update(Tile tile);

    /**
     * Partially updates a tile.
     *
     * @param tile the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Tile> partialUpdate(Tile tile);

    /**
     * Get all the tiles.
     *
     * @return the list of entities.
     */
    List<Tile> findAll();

    /**
     * Get the "id" tile.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Tile> findOne(Long id);

    /**
     * Delete the "id" tile.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
