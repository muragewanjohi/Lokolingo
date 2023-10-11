package com.lokolingo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.lokolingo.IntegrationTest;
import com.lokolingo.domain.LessonTiles;
import com.lokolingo.repository.LessonTilesRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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

/**
 * Integration tests for the {@link LessonTilesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LessonTilesResourceIT {

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/lesson-tiles";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LessonTilesRepository lessonTilesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLessonTilesMockMvc;

    private LessonTiles lessonTiles;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LessonTiles createEntity(EntityManager em) {
        LessonTiles lessonTiles = new LessonTiles().active(DEFAULT_ACTIVE).createdAt(DEFAULT_CREATED_AT).updatedAt(DEFAULT_UPDATED_AT);
        return lessonTiles;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LessonTiles createUpdatedEntity(EntityManager em) {
        LessonTiles lessonTiles = new LessonTiles().active(UPDATED_ACTIVE).createdAt(UPDATED_CREATED_AT).updatedAt(UPDATED_UPDATED_AT);
        return lessonTiles;
    }

    @BeforeEach
    public void initTest() {
        lessonTiles = createEntity(em);
    }

    @Test
    @Transactional
    void createLessonTiles() throws Exception {
        int databaseSizeBeforeCreate = lessonTilesRepository.findAll().size();
        // Create the LessonTiles
        restLessonTilesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lessonTiles)))
            .andExpect(status().isCreated());

        // Validate the LessonTiles in the database
        List<LessonTiles> lessonTilesList = lessonTilesRepository.findAll();
        assertThat(lessonTilesList).hasSize(databaseSizeBeforeCreate + 1);
        LessonTiles testLessonTiles = lessonTilesList.get(lessonTilesList.size() - 1);
        assertThat(testLessonTiles.getActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testLessonTiles.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testLessonTiles.getUpdatedAt()).isEqualTo(DEFAULT_UPDATED_AT);
    }

    @Test
    @Transactional
    void createLessonTilesWithExistingId() throws Exception {
        // Create the LessonTiles with an existing ID
        lessonTiles.setId(1L);

        int databaseSizeBeforeCreate = lessonTilesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLessonTilesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lessonTiles)))
            .andExpect(status().isBadRequest());

        // Validate the LessonTiles in the database
        List<LessonTiles> lessonTilesList = lessonTilesRepository.findAll();
        assertThat(lessonTilesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLessonTiles() throws Exception {
        // Initialize the database
        lessonTilesRepository.saveAndFlush(lessonTiles);

        // Get all the lessonTilesList
        restLessonTilesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lessonTiles.getId().intValue())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())));
    }

    @Test
    @Transactional
    void getLessonTiles() throws Exception {
        // Initialize the database
        lessonTilesRepository.saveAndFlush(lessonTiles);

        // Get the lessonTiles
        restLessonTilesMockMvc
            .perform(get(ENTITY_API_URL_ID, lessonTiles.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lessonTiles.getId().intValue()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.updatedAt").value(DEFAULT_UPDATED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLessonTiles() throws Exception {
        // Get the lessonTiles
        restLessonTilesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLessonTiles() throws Exception {
        // Initialize the database
        lessonTilesRepository.saveAndFlush(lessonTiles);

        int databaseSizeBeforeUpdate = lessonTilesRepository.findAll().size();

        // Update the lessonTiles
        LessonTiles updatedLessonTiles = lessonTilesRepository.findById(lessonTiles.getId()).get();
        // Disconnect from session so that the updates on updatedLessonTiles are not directly saved in db
        em.detach(updatedLessonTiles);
        updatedLessonTiles.active(UPDATED_ACTIVE).createdAt(UPDATED_CREATED_AT).updatedAt(UPDATED_UPDATED_AT);

        restLessonTilesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLessonTiles.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLessonTiles))
            )
            .andExpect(status().isOk());

        // Validate the LessonTiles in the database
        List<LessonTiles> lessonTilesList = lessonTilesRepository.findAll();
        assertThat(lessonTilesList).hasSize(databaseSizeBeforeUpdate);
        LessonTiles testLessonTiles = lessonTilesList.get(lessonTilesList.size() - 1);
        assertThat(testLessonTiles.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testLessonTiles.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testLessonTiles.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void putNonExistingLessonTiles() throws Exception {
        int databaseSizeBeforeUpdate = lessonTilesRepository.findAll().size();
        lessonTiles.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLessonTilesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, lessonTiles.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lessonTiles))
            )
            .andExpect(status().isBadRequest());

        // Validate the LessonTiles in the database
        List<LessonTiles> lessonTilesList = lessonTilesRepository.findAll();
        assertThat(lessonTilesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLessonTiles() throws Exception {
        int databaseSizeBeforeUpdate = lessonTilesRepository.findAll().size();
        lessonTiles.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLessonTilesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lessonTiles))
            )
            .andExpect(status().isBadRequest());

        // Validate the LessonTiles in the database
        List<LessonTiles> lessonTilesList = lessonTilesRepository.findAll();
        assertThat(lessonTilesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLessonTiles() throws Exception {
        int databaseSizeBeforeUpdate = lessonTilesRepository.findAll().size();
        lessonTiles.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLessonTilesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lessonTiles)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LessonTiles in the database
        List<LessonTiles> lessonTilesList = lessonTilesRepository.findAll();
        assertThat(lessonTilesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLessonTilesWithPatch() throws Exception {
        // Initialize the database
        lessonTilesRepository.saveAndFlush(lessonTiles);

        int databaseSizeBeforeUpdate = lessonTilesRepository.findAll().size();

        // Update the lessonTiles using partial update
        LessonTiles partialUpdatedLessonTiles = new LessonTiles();
        partialUpdatedLessonTiles.setId(lessonTiles.getId());

        partialUpdatedLessonTiles.active(UPDATED_ACTIVE).updatedAt(UPDATED_UPDATED_AT);

        restLessonTilesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLessonTiles.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLessonTiles))
            )
            .andExpect(status().isOk());

        // Validate the LessonTiles in the database
        List<LessonTiles> lessonTilesList = lessonTilesRepository.findAll();
        assertThat(lessonTilesList).hasSize(databaseSizeBeforeUpdate);
        LessonTiles testLessonTiles = lessonTilesList.get(lessonTilesList.size() - 1);
        assertThat(testLessonTiles.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testLessonTiles.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testLessonTiles.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void fullUpdateLessonTilesWithPatch() throws Exception {
        // Initialize the database
        lessonTilesRepository.saveAndFlush(lessonTiles);

        int databaseSizeBeforeUpdate = lessonTilesRepository.findAll().size();

        // Update the lessonTiles using partial update
        LessonTiles partialUpdatedLessonTiles = new LessonTiles();
        partialUpdatedLessonTiles.setId(lessonTiles.getId());

        partialUpdatedLessonTiles.active(UPDATED_ACTIVE).createdAt(UPDATED_CREATED_AT).updatedAt(UPDATED_UPDATED_AT);

        restLessonTilesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLessonTiles.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLessonTiles))
            )
            .andExpect(status().isOk());

        // Validate the LessonTiles in the database
        List<LessonTiles> lessonTilesList = lessonTilesRepository.findAll();
        assertThat(lessonTilesList).hasSize(databaseSizeBeforeUpdate);
        LessonTiles testLessonTiles = lessonTilesList.get(lessonTilesList.size() - 1);
        assertThat(testLessonTiles.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testLessonTiles.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testLessonTiles.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void patchNonExistingLessonTiles() throws Exception {
        int databaseSizeBeforeUpdate = lessonTilesRepository.findAll().size();
        lessonTiles.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLessonTilesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lessonTiles.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lessonTiles))
            )
            .andExpect(status().isBadRequest());

        // Validate the LessonTiles in the database
        List<LessonTiles> lessonTilesList = lessonTilesRepository.findAll();
        assertThat(lessonTilesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLessonTiles() throws Exception {
        int databaseSizeBeforeUpdate = lessonTilesRepository.findAll().size();
        lessonTiles.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLessonTilesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lessonTiles))
            )
            .andExpect(status().isBadRequest());

        // Validate the LessonTiles in the database
        List<LessonTiles> lessonTilesList = lessonTilesRepository.findAll();
        assertThat(lessonTilesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLessonTiles() throws Exception {
        int databaseSizeBeforeUpdate = lessonTilesRepository.findAll().size();
        lessonTiles.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLessonTilesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(lessonTiles))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LessonTiles in the database
        List<LessonTiles> lessonTilesList = lessonTilesRepository.findAll();
        assertThat(lessonTilesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLessonTiles() throws Exception {
        // Initialize the database
        lessonTilesRepository.saveAndFlush(lessonTiles);

        int databaseSizeBeforeDelete = lessonTilesRepository.findAll().size();

        // Delete the lessonTiles
        restLessonTilesMockMvc
            .perform(delete(ENTITY_API_URL_ID, lessonTiles.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LessonTiles> lessonTilesList = lessonTilesRepository.findAll();
        assertThat(lessonTilesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
