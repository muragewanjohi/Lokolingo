package com.lokolingo.service.impl;

import com.lokolingo.domain.Tile;
import com.lokolingo.repository.TileRepository;
import com.lokolingo.service.TileService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Tile}.
 */
@Service
@Transactional
public class TileServiceImpl implements TileService {

    private final Logger log = LoggerFactory.getLogger(TileServiceImpl.class);

    private final TileRepository tileRepository;

    public TileServiceImpl(TileRepository tileRepository) {
        this.tileRepository = tileRepository;
    }

    @Override
    public Tile save(Tile tile) {
        log.debug("Request to save Tile : {}", tile);
        return tileRepository.save(tile);
    }

    @Override
    public Tile update(Tile tile) {
        log.debug("Request to update Tile : {}", tile);
        return tileRepository.save(tile);
    }

    @Override
    public Optional<Tile> partialUpdate(Tile tile) {
        log.debug("Request to partially update Tile : {}", tile);

        return tileRepository
            .findById(tile.getId())
            .map(existingTile -> {
                if (tile.getStatus() != null) {
                    existingTile.setStatus(tile.getStatus());
                }
                if (tile.getImage() != null) {
                    existingTile.setImage(tile.getImage());
                }
                if (tile.getImageContentType() != null) {
                    existingTile.setImageContentType(tile.getImageContentType());
                }
                if (tile.getAudio() != null) {
                    existingTile.setAudio(tile.getAudio());
                }
                if (tile.getAudioContentType() != null) {
                    existingTile.setAudioContentType(tile.getAudioContentType());
                }
                if (tile.getLanguageTitle() != null) {
                    existingTile.setLanguageTitle(tile.getLanguageTitle());
                }
                if (tile.getEnglishTitle() != null) {
                    existingTile.setEnglishTitle(tile.getEnglishTitle());
                }

                return existingTile;
            })
            .map(tileRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tile> findAll() {
        log.debug("Request to get all Tiles");
        return tileRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Tile> findOne(Long id) {
        log.debug("Request to get Tile : {}", id);
        return tileRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Tile : {}", id);
        tileRepository.deleteById(id);
    }
}
