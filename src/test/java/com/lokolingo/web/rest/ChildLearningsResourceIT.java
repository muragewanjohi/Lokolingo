package com.lokolingo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.lokolingo.IntegrationTest;
import com.lokolingo.domain.ChildLearnings;
import com.lokolingo.repository.ChildLearningsRepository;
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
 * Integration tests for the {@link ChildLearningsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChildLearningsResourceIT {

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/child-learnings";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChildLearningsRepository childLearningsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChildLearningsMockMvc;

    private ChildLearnings childLearnings;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChildLearnings createEntity(EntityManager em) {
        ChildLearnings childLearnings = new ChildLearnings()
            .active(DEFAULT_ACTIVE)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT);
        return childLearnings;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChildLearnings createUpdatedEntity(EntityManager em) {
        ChildLearnings childLearnings = new ChildLearnings()
            .active(UPDATED_ACTIVE)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);
        return childLearnings;
    }

    @BeforeEach
    public void initTest() {
        childLearnings = createEntity(em);
    }

    @Test
    @Transactional
    void createChildLearnings() throws Exception {
        int databaseSizeBeforeCreate = childLearningsRepository.findAll().size();
        // Create the ChildLearnings
        restChildLearningsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(childLearnings))
            )
            .andExpect(status().isCreated());

        // Validate the ChildLearnings in the database
        List<ChildLearnings> childLearningsList = childLearningsRepository.findAll();
        assertThat(childLearningsList).hasSize(databaseSizeBeforeCreate + 1);
        ChildLearnings testChildLearnings = childLearningsList.get(childLearningsList.size() - 1);
        assertThat(testChildLearnings.getActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testChildLearnings.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testChildLearnings.getUpdatedAt()).isEqualTo(DEFAULT_UPDATED_AT);
    }

    @Test
    @Transactional
    void createChildLearningsWithExistingId() throws Exception {
        // Create the ChildLearnings with an existing ID
        childLearnings.setId(1L);

        int databaseSizeBeforeCreate = childLearningsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChildLearningsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(childLearnings))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChildLearnings in the database
        List<ChildLearnings> childLearningsList = childLearningsRepository.findAll();
        assertThat(childLearningsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllChildLearnings() throws Exception {
        // Initialize the database
        childLearningsRepository.saveAndFlush(childLearnings);

        // Get all the childLearningsList
        restChildLearningsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(childLearnings.getId().intValue())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())));
    }

    @Test
    @Transactional
    void getChildLearnings() throws Exception {
        // Initialize the database
        childLearningsRepository.saveAndFlush(childLearnings);

        // Get the childLearnings
        restChildLearningsMockMvc
            .perform(get(ENTITY_API_URL_ID, childLearnings.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(childLearnings.getId().intValue()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.updatedAt").value(DEFAULT_UPDATED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingChildLearnings() throws Exception {
        // Get the childLearnings
        restChildLearningsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingChildLearnings() throws Exception {
        // Initialize the database
        childLearningsRepository.saveAndFlush(childLearnings);

        int databaseSizeBeforeUpdate = childLearningsRepository.findAll().size();

        // Update the childLearnings
        ChildLearnings updatedChildLearnings = childLearningsRepository.findById(childLearnings.getId()).get();
        // Disconnect from session so that the updates on updatedChildLearnings are not directly saved in db
        em.detach(updatedChildLearnings);
        updatedChildLearnings.active(UPDATED_ACTIVE).createdAt(UPDATED_CREATED_AT).updatedAt(UPDATED_UPDATED_AT);

        restChildLearningsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChildLearnings.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChildLearnings))
            )
            .andExpect(status().isOk());

        // Validate the ChildLearnings in the database
        List<ChildLearnings> childLearningsList = childLearningsRepository.findAll();
        assertThat(childLearningsList).hasSize(databaseSizeBeforeUpdate);
        ChildLearnings testChildLearnings = childLearningsList.get(childLearningsList.size() - 1);
        assertThat(testChildLearnings.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testChildLearnings.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testChildLearnings.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void putNonExistingChildLearnings() throws Exception {
        int databaseSizeBeforeUpdate = childLearningsRepository.findAll().size();
        childLearnings.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChildLearningsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, childLearnings.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(childLearnings))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChildLearnings in the database
        List<ChildLearnings> childLearningsList = childLearningsRepository.findAll();
        assertThat(childLearningsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChildLearnings() throws Exception {
        int databaseSizeBeforeUpdate = childLearningsRepository.findAll().size();
        childLearnings.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChildLearningsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(childLearnings))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChildLearnings in the database
        List<ChildLearnings> childLearningsList = childLearningsRepository.findAll();
        assertThat(childLearningsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChildLearnings() throws Exception {
        int databaseSizeBeforeUpdate = childLearningsRepository.findAll().size();
        childLearnings.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChildLearningsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(childLearnings)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChildLearnings in the database
        List<ChildLearnings> childLearningsList = childLearningsRepository.findAll();
        assertThat(childLearningsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChildLearningsWithPatch() throws Exception {
        // Initialize the database
        childLearningsRepository.saveAndFlush(childLearnings);

        int databaseSizeBeforeUpdate = childLearningsRepository.findAll().size();

        // Update the childLearnings using partial update
        ChildLearnings partialUpdatedChildLearnings = new ChildLearnings();
        partialUpdatedChildLearnings.setId(childLearnings.getId());

        partialUpdatedChildLearnings.active(UPDATED_ACTIVE).updatedAt(UPDATED_UPDATED_AT);

        restChildLearningsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChildLearnings.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChildLearnings))
            )
            .andExpect(status().isOk());

        // Validate the ChildLearnings in the database
        List<ChildLearnings> childLearningsList = childLearningsRepository.findAll();
        assertThat(childLearningsList).hasSize(databaseSizeBeforeUpdate);
        ChildLearnings testChildLearnings = childLearningsList.get(childLearningsList.size() - 1);
        assertThat(testChildLearnings.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testChildLearnings.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testChildLearnings.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void fullUpdateChildLearningsWithPatch() throws Exception {
        // Initialize the database
        childLearningsRepository.saveAndFlush(childLearnings);

        int databaseSizeBeforeUpdate = childLearningsRepository.findAll().size();

        // Update the childLearnings using partial update
        ChildLearnings partialUpdatedChildLearnings = new ChildLearnings();
        partialUpdatedChildLearnings.setId(childLearnings.getId());

        partialUpdatedChildLearnings.active(UPDATED_ACTIVE).createdAt(UPDATED_CREATED_AT).updatedAt(UPDATED_UPDATED_AT);

        restChildLearningsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChildLearnings.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChildLearnings))
            )
            .andExpect(status().isOk());

        // Validate the ChildLearnings in the database
        List<ChildLearnings> childLearningsList = childLearningsRepository.findAll();
        assertThat(childLearningsList).hasSize(databaseSizeBeforeUpdate);
        ChildLearnings testChildLearnings = childLearningsList.get(childLearningsList.size() - 1);
        assertThat(testChildLearnings.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testChildLearnings.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testChildLearnings.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void patchNonExistingChildLearnings() throws Exception {
        int databaseSizeBeforeUpdate = childLearningsRepository.findAll().size();
        childLearnings.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChildLearningsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, childLearnings.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(childLearnings))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChildLearnings in the database
        List<ChildLearnings> childLearningsList = childLearningsRepository.findAll();
        assertThat(childLearningsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChildLearnings() throws Exception {
        int databaseSizeBeforeUpdate = childLearningsRepository.findAll().size();
        childLearnings.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChildLearningsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(childLearnings))
            )
            .andExpect(status().isBadRequest());

        // Validate the ChildLearnings in the database
        List<ChildLearnings> childLearningsList = childLearningsRepository.findAll();
        assertThat(childLearningsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChildLearnings() throws Exception {
        int databaseSizeBeforeUpdate = childLearningsRepository.findAll().size();
        childLearnings.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChildLearningsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(childLearnings))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ChildLearnings in the database
        List<ChildLearnings> childLearningsList = childLearningsRepository.findAll();
        assertThat(childLearningsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChildLearnings() throws Exception {
        // Initialize the database
        childLearningsRepository.saveAndFlush(childLearnings);

        int databaseSizeBeforeDelete = childLearningsRepository.findAll().size();

        // Delete the childLearnings
        restChildLearningsMockMvc
            .perform(delete(ENTITY_API_URL_ID, childLearnings.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChildLearnings> childLearningsList = childLearningsRepository.findAll();
        assertThat(childLearningsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
