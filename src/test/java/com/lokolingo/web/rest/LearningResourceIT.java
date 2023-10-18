package com.lokolingo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.lokolingo.IntegrationTest;
import com.lokolingo.domain.Learning;
import com.lokolingo.repository.LearningRepository;
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
 * Integration tests for the {@link LearningResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LearningResourceIT {

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/learnings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LearningRepository learningRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLearningMockMvc;

    private Learning learning;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Learning createEntity(EntityManager em) {
        Learning learning = new Learning().startDate(DEFAULT_START_DATE).endDate(DEFAULT_END_DATE);
        return learning;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Learning createUpdatedEntity(EntityManager em) {
        Learning learning = new Learning().startDate(UPDATED_START_DATE).endDate(UPDATED_END_DATE);
        return learning;
    }

    @BeforeEach
    public void initTest() {
        learning = createEntity(em);
    }

    @Test
    @Transactional
    void createLearning() throws Exception {
        int databaseSizeBeforeCreate = learningRepository.findAll().size();
        // Create the Learning
        restLearningMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(learning)))
            .andExpect(status().isCreated());

        // Validate the Learning in the database
        List<Learning> learningList = learningRepository.findAll();
        assertThat(learningList).hasSize(databaseSizeBeforeCreate + 1);
        Learning testLearning = learningList.get(learningList.size() - 1);
        assertThat(testLearning.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testLearning.getEndDate()).isEqualTo(DEFAULT_END_DATE);
    }

    @Test
    @Transactional
    void createLearningWithExistingId() throws Exception {
        // Create the Learning with an existing ID
        learning.setId(1L);

        int databaseSizeBeforeCreate = learningRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLearningMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(learning)))
            .andExpect(status().isBadRequest());

        // Validate the Learning in the database
        List<Learning> learningList = learningRepository.findAll();
        assertThat(learningList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStartDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = learningRepository.findAll().size();
        // set the field null
        learning.setStartDate(null);

        // Create the Learning, which fails.

        restLearningMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(learning)))
            .andExpect(status().isBadRequest());

        List<Learning> learningList = learningRepository.findAll();
        assertThat(learningList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLearnings() throws Exception {
        // Initialize the database
        learningRepository.saveAndFlush(learning);

        // Get all the learningList
        restLearningMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(learning.getId().intValue())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())));
    }

    @Test
    @Transactional
    void getLearning() throws Exception {
        // Initialize the database
        learningRepository.saveAndFlush(learning);

        // Get the learning
        restLearningMockMvc
            .perform(get(ENTITY_API_URL_ID, learning.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(learning.getId().intValue()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLearning() throws Exception {
        // Get the learning
        restLearningMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLearning() throws Exception {
        // Initialize the database
        learningRepository.saveAndFlush(learning);

        int databaseSizeBeforeUpdate = learningRepository.findAll().size();

        // Update the learning
        Learning updatedLearning = learningRepository.findById(learning.getId()).get();
        // Disconnect from session so that the updates on updatedLearning are not directly saved in db
        em.detach(updatedLearning);
        updatedLearning.startDate(UPDATED_START_DATE).endDate(UPDATED_END_DATE);

        restLearningMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLearning.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLearning))
            )
            .andExpect(status().isOk());

        // Validate the Learning in the database
        List<Learning> learningList = learningRepository.findAll();
        assertThat(learningList).hasSize(databaseSizeBeforeUpdate);
        Learning testLearning = learningList.get(learningList.size() - 1);
        assertThat(testLearning.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testLearning.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void putNonExistingLearning() throws Exception {
        int databaseSizeBeforeUpdate = learningRepository.findAll().size();
        learning.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLearningMockMvc
            .perform(
                put(ENTITY_API_URL_ID, learning.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(learning))
            )
            .andExpect(status().isBadRequest());

        // Validate the Learning in the database
        List<Learning> learningList = learningRepository.findAll();
        assertThat(learningList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLearning() throws Exception {
        int databaseSizeBeforeUpdate = learningRepository.findAll().size();
        learning.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(learning))
            )
            .andExpect(status().isBadRequest());

        // Validate the Learning in the database
        List<Learning> learningList = learningRepository.findAll();
        assertThat(learningList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLearning() throws Exception {
        int databaseSizeBeforeUpdate = learningRepository.findAll().size();
        learning.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(learning)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Learning in the database
        List<Learning> learningList = learningRepository.findAll();
        assertThat(learningList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLearningWithPatch() throws Exception {
        // Initialize the database
        learningRepository.saveAndFlush(learning);

        int databaseSizeBeforeUpdate = learningRepository.findAll().size();

        // Update the learning using partial update
        Learning partialUpdatedLearning = new Learning();
        partialUpdatedLearning.setId(learning.getId());

        partialUpdatedLearning.endDate(UPDATED_END_DATE);

        restLearningMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLearning.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLearning))
            )
            .andExpect(status().isOk());

        // Validate the Learning in the database
        List<Learning> learningList = learningRepository.findAll();
        assertThat(learningList).hasSize(databaseSizeBeforeUpdate);
        Learning testLearning = learningList.get(learningList.size() - 1);
        assertThat(testLearning.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testLearning.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void fullUpdateLearningWithPatch() throws Exception {
        // Initialize the database
        learningRepository.saveAndFlush(learning);

        int databaseSizeBeforeUpdate = learningRepository.findAll().size();

        // Update the learning using partial update
        Learning partialUpdatedLearning = new Learning();
        partialUpdatedLearning.setId(learning.getId());

        partialUpdatedLearning.startDate(UPDATED_START_DATE).endDate(UPDATED_END_DATE);

        restLearningMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLearning.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLearning))
            )
            .andExpect(status().isOk());

        // Validate the Learning in the database
        List<Learning> learningList = learningRepository.findAll();
        assertThat(learningList).hasSize(databaseSizeBeforeUpdate);
        Learning testLearning = learningList.get(learningList.size() - 1);
        assertThat(testLearning.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testLearning.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingLearning() throws Exception {
        int databaseSizeBeforeUpdate = learningRepository.findAll().size();
        learning.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLearningMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, learning.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(learning))
            )
            .andExpect(status().isBadRequest());

        // Validate the Learning in the database
        List<Learning> learningList = learningRepository.findAll();
        assertThat(learningList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLearning() throws Exception {
        int databaseSizeBeforeUpdate = learningRepository.findAll().size();
        learning.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(learning))
            )
            .andExpect(status().isBadRequest());

        // Validate the Learning in the database
        List<Learning> learningList = learningRepository.findAll();
        assertThat(learningList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLearning() throws Exception {
        int databaseSizeBeforeUpdate = learningRepository.findAll().size();
        learning.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLearningMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(learning)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Learning in the database
        List<Learning> learningList = learningRepository.findAll();
        assertThat(learningList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLearning() throws Exception {
        // Initialize the database
        learningRepository.saveAndFlush(learning);

        int databaseSizeBeforeDelete = learningRepository.findAll().size();

        // Delete the learning
        restLearningMockMvc
            .perform(delete(ENTITY_API_URL_ID, learning.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Learning> learningList = learningRepository.findAll();
        assertThat(learningList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
