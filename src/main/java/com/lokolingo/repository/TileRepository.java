package com.lokolingo.repository;

import com.lokolingo.domain.Tile;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Tile entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TileRepository extends JpaRepository<Tile, Long> {}
