package com.lokolingo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.lokolingo.IntegrationTest;
import com.lokolingo.domain.Tile;
import com.lokolingo.domain.enumeration.LockedStatus;
import com.lokolingo.repository.TileRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link TileResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class TileResourceIT {

    private static final LockedStatus DEFAULT_STATUS = LockedStatus.LOCKED;
    private static final LockedStatus UPDATED_STATUS = LockedStatus.UNLOCKED;

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_AUDIO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_AUDIO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_AUDIO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_AUDIO_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_LANGUAGE_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_LANGUAGE_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_ENGLISH_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_ENGLISH_TITLE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/tiles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private TileRepository tileRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTileMockMvc;

    private Tile tile;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tile createEntity(EntityManager em) {
        Tile tile = new Tile()
            .status(DEFAULT_STATUS)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE)
            .audio(DEFAULT_AUDIO)
            .audioContentType(DEFAULT_AUDIO_CONTENT_TYPE)
            .languageTitle(DEFAULT_LANGUAGE_TITLE)
            .englishTitle(DEFAULT_ENGLISH_TITLE);
        return tile;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tile createUpdatedEntity(EntityManager em) {
        Tile tile = new Tile()
            .status(UPDATED_STATUS)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .audio(UPDATED_AUDIO)
            .audioContentType(UPDATED_AUDIO_CONTENT_TYPE)
            .languageTitle(UPDATED_LANGUAGE_TITLE)
            .englishTitle(UPDATED_ENGLISH_TITLE);
        return tile;
    }

    @BeforeEach
    public void initTest() {
        tile = createEntity(em);
    }

    @Test
    @Transactional
    void createTile() throws Exception {
        int databaseSizeBeforeCreate = tileRepository.findAll().size();
        // Create the Tile
        restTileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tile)))
            .andExpect(status().isCreated());

        // Validate the Tile in the database
        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeCreate + 1);
        Tile testTile = tileList.get(tileList.size() - 1);
        assertThat(testTile.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testTile.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testTile.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testTile.getAudio()).isEqualTo(DEFAULT_AUDIO);
        assertThat(testTile.getAudioContentType()).isEqualTo(DEFAULT_AUDIO_CONTENT_TYPE);
        assertThat(testTile.getLanguageTitle()).isEqualTo(DEFAULT_LANGUAGE_TITLE);
        assertThat(testTile.getEnglishTitle()).isEqualTo(DEFAULT_ENGLISH_TITLE);
    }

    @Test
    @Transactional
    void createTileWithExistingId() throws Exception {
        // Create the Tile with an existing ID
        tile.setId(1L);

        int databaseSizeBeforeCreate = tileRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restTileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tile)))
            .andExpect(status().isBadRequest());

        // Validate the Tile in the database
        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = tileRepository.findAll().size();
        // set the field null
        tile.setStatus(null);

        // Create the Tile, which fails.

        restTileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tile)))
            .andExpect(status().isBadRequest());

        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLanguageTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = tileRepository.findAll().size();
        // set the field null
        tile.setLanguageTitle(null);

        // Create the Tile, which fails.

        restTileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tile)))
            .andExpect(status().isBadRequest());

        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEnglishTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = tileRepository.findAll().size();
        // set the field null
        tile.setEnglishTitle(null);

        // Create the Tile, which fails.

        restTileMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tile)))
            .andExpect(status().isBadRequest());

        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllTiles() throws Exception {
        // Initialize the database
        tileRepository.saveAndFlush(tile);

        // Get all the tileList
        restTileMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tile.getId().intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))))
            .andExpect(jsonPath("$.[*].audioContentType").value(hasItem(DEFAULT_AUDIO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].audio").value(hasItem(Base64Utils.encodeToString(DEFAULT_AUDIO))))
            .andExpect(jsonPath("$.[*].languageTitle").value(hasItem(DEFAULT_LANGUAGE_TITLE)))
            .andExpect(jsonPath("$.[*].englishTitle").value(hasItem(DEFAULT_ENGLISH_TITLE)));
    }

    @Test
    @Transactional
    void getTile() throws Exception {
        // Initialize the database
        tileRepository.saveAndFlush(tile);

        // Get the tile
        restTileMockMvc
            .perform(get(ENTITY_API_URL_ID, tile.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tile.getId().intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)))
            .andExpect(jsonPath("$.audioContentType").value(DEFAULT_AUDIO_CONTENT_TYPE))
            .andExpect(jsonPath("$.audio").value(Base64Utils.encodeToString(DEFAULT_AUDIO)))
            .andExpect(jsonPath("$.languageTitle").value(DEFAULT_LANGUAGE_TITLE))
            .andExpect(jsonPath("$.englishTitle").value(DEFAULT_ENGLISH_TITLE));
    }

    @Test
    @Transactional
    void getNonExistingTile() throws Exception {
        // Get the tile
        restTileMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingTile() throws Exception {
        // Initialize the database
        tileRepository.saveAndFlush(tile);

        int databaseSizeBeforeUpdate = tileRepository.findAll().size();

        // Update the tile
        Tile updatedTile = tileRepository.findById(tile.getId()).get();
        // Disconnect from session so that the updates on updatedTile are not directly saved in db
        em.detach(updatedTile);
        updatedTile
            .status(UPDATED_STATUS)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .audio(UPDATED_AUDIO)
            .audioContentType(UPDATED_AUDIO_CONTENT_TYPE)
            .languageTitle(UPDATED_LANGUAGE_TITLE)
            .englishTitle(UPDATED_ENGLISH_TITLE);

        restTileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedTile.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedTile))
            )
            .andExpect(status().isOk());

        // Validate the Tile in the database
        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeUpdate);
        Tile testTile = tileList.get(tileList.size() - 1);
        assertThat(testTile.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testTile.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testTile.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testTile.getAudio()).isEqualTo(UPDATED_AUDIO);
        assertThat(testTile.getAudioContentType()).isEqualTo(UPDATED_AUDIO_CONTENT_TYPE);
        assertThat(testTile.getLanguageTitle()).isEqualTo(UPDATED_LANGUAGE_TITLE);
        assertThat(testTile.getEnglishTitle()).isEqualTo(UPDATED_ENGLISH_TITLE);
    }

    @Test
    @Transactional
    void putNonExistingTile() throws Exception {
        int databaseSizeBeforeUpdate = tileRepository.findAll().size();
        tile.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, tile.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tile))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tile in the database
        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchTile() throws Exception {
        int databaseSizeBeforeUpdate = tileRepository.findAll().size();
        tile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTileMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(tile))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tile in the database
        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamTile() throws Exception {
        int databaseSizeBeforeUpdate = tileRepository.findAll().size();
        tile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTileMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(tile)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tile in the database
        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateTileWithPatch() throws Exception {
        // Initialize the database
        tileRepository.saveAndFlush(tile);

        int databaseSizeBeforeUpdate = tileRepository.findAll().size();

        // Update the tile using partial update
        Tile partialUpdatedTile = new Tile();
        partialUpdatedTile.setId(tile.getId());

        partialUpdatedTile.audio(UPDATED_AUDIO).audioContentType(UPDATED_AUDIO_CONTENT_TYPE).languageTitle(UPDATED_LANGUAGE_TITLE);

        restTileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTile))
            )
            .andExpect(status().isOk());

        // Validate the Tile in the database
        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeUpdate);
        Tile testTile = tileList.get(tileList.size() - 1);
        assertThat(testTile.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testTile.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testTile.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
        assertThat(testTile.getAudio()).isEqualTo(UPDATED_AUDIO);
        assertThat(testTile.getAudioContentType()).isEqualTo(UPDATED_AUDIO_CONTENT_TYPE);
        assertThat(testTile.getLanguageTitle()).isEqualTo(UPDATED_LANGUAGE_TITLE);
        assertThat(testTile.getEnglishTitle()).isEqualTo(DEFAULT_ENGLISH_TITLE);
    }

    @Test
    @Transactional
    void fullUpdateTileWithPatch() throws Exception {
        // Initialize the database
        tileRepository.saveAndFlush(tile);

        int databaseSizeBeforeUpdate = tileRepository.findAll().size();

        // Update the tile using partial update
        Tile partialUpdatedTile = new Tile();
        partialUpdatedTile.setId(tile.getId());

        partialUpdatedTile
            .status(UPDATED_STATUS)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE)
            .audio(UPDATED_AUDIO)
            .audioContentType(UPDATED_AUDIO_CONTENT_TYPE)
            .languageTitle(UPDATED_LANGUAGE_TITLE)
            .englishTitle(UPDATED_ENGLISH_TITLE);

        restTileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedTile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedTile))
            )
            .andExpect(status().isOk());

        // Validate the Tile in the database
        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeUpdate);
        Tile testTile = tileList.get(tileList.size() - 1);
        assertThat(testTile.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testTile.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testTile.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
        assertThat(testTile.getAudio()).isEqualTo(UPDATED_AUDIO);
        assertThat(testTile.getAudioContentType()).isEqualTo(UPDATED_AUDIO_CONTENT_TYPE);
        assertThat(testTile.getLanguageTitle()).isEqualTo(UPDATED_LANGUAGE_TITLE);
        assertThat(testTile.getEnglishTitle()).isEqualTo(UPDATED_ENGLISH_TITLE);
    }

    @Test
    @Transactional
    void patchNonExistingTile() throws Exception {
        int databaseSizeBeforeUpdate = tileRepository.findAll().size();
        tile.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, tile.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tile))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tile in the database
        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchTile() throws Exception {
        int databaseSizeBeforeUpdate = tileRepository.findAll().size();
        tile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTileMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(tile))
            )
            .andExpect(status().isBadRequest());

        // Validate the Tile in the database
        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamTile() throws Exception {
        int databaseSizeBeforeUpdate = tileRepository.findAll().size();
        tile.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restTileMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(tile)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Tile in the database
        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteTile() throws Exception {
        // Initialize the database
        tileRepository.saveAndFlush(tile);

        int databaseSizeBeforeDelete = tileRepository.findAll().size();

        // Delete the tile
        restTileMockMvc
            .perform(delete(ENTITY_API_URL_ID, tile.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Tile> tileList = tileRepository.findAll();
        assertThat(tileList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
