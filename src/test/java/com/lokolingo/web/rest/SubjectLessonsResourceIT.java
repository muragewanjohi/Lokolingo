package com.lokolingo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.lokolingo.IntegrationTest;
import com.lokolingo.domain.SubjectLessons;
import com.lokolingo.repository.SubjectLessonsRepository;
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
 * Integration tests for the {@link SubjectLessonsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SubjectLessonsResourceIT {

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final Instant DEFAULT_CREATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATED_AT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_AT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/subject-lessons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SubjectLessonsRepository subjectLessonsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSubjectLessonsMockMvc;

    private SubjectLessons subjectLessons;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SubjectLessons createEntity(EntityManager em) {
        SubjectLessons subjectLessons = new SubjectLessons()
            .active(DEFAULT_ACTIVE)
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT);
        return subjectLessons;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SubjectLessons createUpdatedEntity(EntityManager em) {
        SubjectLessons subjectLessons = new SubjectLessons()
            .active(UPDATED_ACTIVE)
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);
        return subjectLessons;
    }

    @BeforeEach
    public void initTest() {
        subjectLessons = createEntity(em);
    }

    @Test
    @Transactional
    void createSubjectLessons() throws Exception {
        int databaseSizeBeforeCreate = subjectLessonsRepository.findAll().size();
        // Create the SubjectLessons
        restSubjectLessonsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(subjectLessons))
            )
            .andExpect(status().isCreated());

        // Validate the SubjectLessons in the database
        List<SubjectLessons> subjectLessonsList = subjectLessonsRepository.findAll();
        assertThat(subjectLessonsList).hasSize(databaseSizeBeforeCreate + 1);
        SubjectLessons testSubjectLessons = subjectLessonsList.get(subjectLessonsList.size() - 1);
        assertThat(testSubjectLessons.getActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testSubjectLessons.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testSubjectLessons.getUpdatedAt()).isEqualTo(DEFAULT_UPDATED_AT);
    }

    @Test
    @Transactional
    void createSubjectLessonsWithExistingId() throws Exception {
        // Create the SubjectLessons with an existing ID
        subjectLessons.setId(1L);

        int databaseSizeBeforeCreate = subjectLessonsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSubjectLessonsMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(subjectLessons))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubjectLessons in the database
        List<SubjectLessons> subjectLessonsList = subjectLessonsRepository.findAll();
        assertThat(subjectLessonsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSubjectLessons() throws Exception {
        // Initialize the database
        subjectLessonsRepository.saveAndFlush(subjectLessons);

        // Get all the subjectLessonsList
        restSubjectLessonsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(subjectLessons.getId().intValue())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(DEFAULT_UPDATED_AT.toString())));
    }

    @Test
    @Transactional
    void getSubjectLessons() throws Exception {
        // Initialize the database
        subjectLessonsRepository.saveAndFlush(subjectLessons);

        // Get the subjectLessons
        restSubjectLessonsMockMvc
            .perform(get(ENTITY_API_URL_ID, subjectLessons.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(subjectLessons.getId().intValue()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.updatedAt").value(DEFAULT_UPDATED_AT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSubjectLessons() throws Exception {
        // Get the subjectLessons
        restSubjectLessonsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSubjectLessons() throws Exception {
        // Initialize the database
        subjectLessonsRepository.saveAndFlush(subjectLessons);

        int databaseSizeBeforeUpdate = subjectLessonsRepository.findAll().size();

        // Update the subjectLessons
        SubjectLessons updatedSubjectLessons = subjectLessonsRepository.findById(subjectLessons.getId()).get();
        // Disconnect from session so that the updates on updatedSubjectLessons are not directly saved in db
        em.detach(updatedSubjectLessons);
        updatedSubjectLessons.active(UPDATED_ACTIVE).createdAt(UPDATED_CREATED_AT).updatedAt(UPDATED_UPDATED_AT);

        restSubjectLessonsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSubjectLessons.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSubjectLessons))
            )
            .andExpect(status().isOk());

        // Validate the SubjectLessons in the database
        List<SubjectLessons> subjectLessonsList = subjectLessonsRepository.findAll();
        assertThat(subjectLessonsList).hasSize(databaseSizeBeforeUpdate);
        SubjectLessons testSubjectLessons = subjectLessonsList.get(subjectLessonsList.size() - 1);
        assertThat(testSubjectLessons.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testSubjectLessons.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testSubjectLessons.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void putNonExistingSubjectLessons() throws Exception {
        int databaseSizeBeforeUpdate = subjectLessonsRepository.findAll().size();
        subjectLessons.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSubjectLessonsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, subjectLessons.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(subjectLessons))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubjectLessons in the database
        List<SubjectLessons> subjectLessonsList = subjectLessonsRepository.findAll();
        assertThat(subjectLessonsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSubjectLessons() throws Exception {
        int databaseSizeBeforeUpdate = subjectLessonsRepository.findAll().size();
        subjectLessons.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubjectLessonsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(subjectLessons))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubjectLessons in the database
        List<SubjectLessons> subjectLessonsList = subjectLessonsRepository.findAll();
        assertThat(subjectLessonsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSubjectLessons() throws Exception {
        int databaseSizeBeforeUpdate = subjectLessonsRepository.findAll().size();
        subjectLessons.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubjectLessonsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(subjectLessons)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SubjectLessons in the database
        List<SubjectLessons> subjectLessonsList = subjectLessonsRepository.findAll();
        assertThat(subjectLessonsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSubjectLessonsWithPatch() throws Exception {
        // Initialize the database
        subjectLessonsRepository.saveAndFlush(subjectLessons);

        int databaseSizeBeforeUpdate = subjectLessonsRepository.findAll().size();

        // Update the subjectLessons using partial update
        SubjectLessons partialUpdatedSubjectLessons = new SubjectLessons();
        partialUpdatedSubjectLessons.setId(subjectLessons.getId());

        partialUpdatedSubjectLessons.createdAt(UPDATED_CREATED_AT);

        restSubjectLessonsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSubjectLessons.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSubjectLessons))
            )
            .andExpect(status().isOk());

        // Validate the SubjectLessons in the database
        List<SubjectLessons> subjectLessonsList = subjectLessonsRepository.findAll();
        assertThat(subjectLessonsList).hasSize(databaseSizeBeforeUpdate);
        SubjectLessons testSubjectLessons = subjectLessonsList.get(subjectLessonsList.size() - 1);
        assertThat(testSubjectLessons.getActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testSubjectLessons.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testSubjectLessons.getUpdatedAt()).isEqualTo(DEFAULT_UPDATED_AT);
    }

    @Test
    @Transactional
    void fullUpdateSubjectLessonsWithPatch() throws Exception {
        // Initialize the database
        subjectLessonsRepository.saveAndFlush(subjectLessons);

        int databaseSizeBeforeUpdate = subjectLessonsRepository.findAll().size();

        // Update the subjectLessons using partial update
        SubjectLessons partialUpdatedSubjectLessons = new SubjectLessons();
        partialUpdatedSubjectLessons.setId(subjectLessons.getId());

        partialUpdatedSubjectLessons.active(UPDATED_ACTIVE).createdAt(UPDATED_CREATED_AT).updatedAt(UPDATED_UPDATED_AT);

        restSubjectLessonsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSubjectLessons.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSubjectLessons))
            )
            .andExpect(status().isOk());

        // Validate the SubjectLessons in the database
        List<SubjectLessons> subjectLessonsList = subjectLessonsRepository.findAll();
        assertThat(subjectLessonsList).hasSize(databaseSizeBeforeUpdate);
        SubjectLessons testSubjectLessons = subjectLessonsList.get(subjectLessonsList.size() - 1);
        assertThat(testSubjectLessons.getActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testSubjectLessons.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testSubjectLessons.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);
    }

    @Test
    @Transactional
    void patchNonExistingSubjectLessons() throws Exception {
        int databaseSizeBeforeUpdate = subjectLessonsRepository.findAll().size();
        subjectLessons.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSubjectLessonsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, subjectLessons.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(subjectLessons))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubjectLessons in the database
        List<SubjectLessons> subjectLessonsList = subjectLessonsRepository.findAll();
        assertThat(subjectLessonsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSubjectLessons() throws Exception {
        int databaseSizeBeforeUpdate = subjectLessonsRepository.findAll().size();
        subjectLessons.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubjectLessonsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(subjectLessons))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubjectLessons in the database
        List<SubjectLessons> subjectLessonsList = subjectLessonsRepository.findAll();
        assertThat(subjectLessonsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSubjectLessons() throws Exception {
        int databaseSizeBeforeUpdate = subjectLessonsRepository.findAll().size();
        subjectLessons.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubjectLessonsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(subjectLessons))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SubjectLessons in the database
        List<SubjectLessons> subjectLessonsList = subjectLessonsRepository.findAll();
        assertThat(subjectLessonsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSubjectLessons() throws Exception {
        // Initialize the database
        subjectLessonsRepository.saveAndFlush(subjectLessons);

        int databaseSizeBeforeDelete = subjectLessonsRepository.findAll().size();

        // Delete the subjectLessons
        restSubjectLessonsMockMvc
            .perform(delete(ENTITY_API_URL_ID, subjectLessons.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SubjectLessons> subjectLessonsList = subjectLessonsRepository.findAll();
        assertThat(subjectLessonsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
