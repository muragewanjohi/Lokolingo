package com.lokolingo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.lokolingo.IntegrationTest;
import com.lokolingo.domain.MultipleChoice;
import com.lokolingo.domain.enumeration.AnswerStatus;
import com.lokolingo.repository.MultipleChoiceRepository;
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
 * Integration tests for the {@link MultipleChoiceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MultipleChoiceResourceIT {

    private static final AnswerStatus DEFAULT_STATUS = AnswerStatus.CORRECT;
    private static final AnswerStatus UPDATED_STATUS = AnswerStatus.WRONG;

    private static final byte[] DEFAULT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_IMAGE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/multiple-choices";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MultipleChoiceRepository multipleChoiceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMultipleChoiceMockMvc;

    private MultipleChoice multipleChoice;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MultipleChoice createEntity(EntityManager em) {
        MultipleChoice multipleChoice = new MultipleChoice()
            .status(DEFAULT_STATUS)
            .image(DEFAULT_IMAGE)
            .imageContentType(DEFAULT_IMAGE_CONTENT_TYPE);
        return multipleChoice;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MultipleChoice createUpdatedEntity(EntityManager em) {
        MultipleChoice multipleChoice = new MultipleChoice()
            .status(UPDATED_STATUS)
            .image(UPDATED_IMAGE)
            .imageContentType(UPDATED_IMAGE_CONTENT_TYPE);
        return multipleChoice;
    }

    @BeforeEach
    public void initTest() {
        multipleChoice = createEntity(em);
    }

    @Test
    @Transactional
    void createMultipleChoice() throws Exception {
        int databaseSizeBeforeCreate = multipleChoiceRepository.findAll().size();
        // Create the MultipleChoice
        restMultipleChoiceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(multipleChoice))
            )
            .andExpect(status().isCreated());

        // Validate the MultipleChoice in the database
        List<MultipleChoice> multipleChoiceList = multipleChoiceRepository.findAll();
        assertThat(multipleChoiceList).hasSize(databaseSizeBeforeCreate + 1);
        MultipleChoice testMultipleChoice = multipleChoiceList.get(multipleChoiceList.size() - 1);
        assertThat(testMultipleChoice.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testMultipleChoice.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testMultipleChoice.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createMultipleChoiceWithExistingId() throws Exception {
        // Create the MultipleChoice with an existing ID
        multipleChoice.setId(1L);

        int databaseSizeBeforeCreate = multipleChoiceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMultipleChoiceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(multipleChoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MultipleChoice in the database
        List<MultipleChoice> multipleChoiceList = multipleChoiceRepository.findAll();
        assertThat(multipleChoiceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = multipleChoiceRepository.findAll().size();
        // set the field null
        multipleChoice.setStatus(null);

        // Create the MultipleChoice, which fails.

        restMultipleChoiceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(multipleChoice))
            )
            .andExpect(status().isBadRequest());

        List<MultipleChoice> multipleChoiceList = multipleChoiceRepository.findAll();
        assertThat(multipleChoiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMultipleChoices() throws Exception {
        // Initialize the database
        multipleChoiceRepository.saveAndFlush(multipleChoice);

        // Get all the multipleChoiceList
        restMultipleChoiceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(multipleChoice.getId().intValue())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].imageContentType").value(hasItem(DEFAULT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].image").value(hasItem(Base64Utils.encodeToString(DEFAULT_IMAGE))));
    }

    @Test
    @Transactional
    void getMultipleChoice() throws Exception {
        // Initialize the database
        multipleChoiceRepository.saveAndFlush(multipleChoice);

        // Get the multipleChoice
        restMultipleChoiceMockMvc
            .perform(get(ENTITY_API_URL_ID, multipleChoice.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(multipleChoice.getId().intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.imageContentType").value(DEFAULT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.image").value(Base64Utils.encodeToString(DEFAULT_IMAGE)));
    }

    @Test
    @Transactional
    void getNonExistingMultipleChoice() throws Exception {
        // Get the multipleChoice
        restMultipleChoiceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMultipleChoice() throws Exception {
        // Initialize the database
        multipleChoiceRepository.saveAndFlush(multipleChoice);

        int databaseSizeBeforeUpdate = multipleChoiceRepository.findAll().size();

        // Update the multipleChoice
        MultipleChoice updatedMultipleChoice = multipleChoiceRepository.findById(multipleChoice.getId()).get();
        // Disconnect from session so that the updates on updatedMultipleChoice are not directly saved in db
        em.detach(updatedMultipleChoice);
        updatedMultipleChoice.status(UPDATED_STATUS).image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restMultipleChoiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMultipleChoice.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMultipleChoice))
            )
            .andExpect(status().isOk());

        // Validate the MultipleChoice in the database
        List<MultipleChoice> multipleChoiceList = multipleChoiceRepository.findAll();
        assertThat(multipleChoiceList).hasSize(databaseSizeBeforeUpdate);
        MultipleChoice testMultipleChoice = multipleChoiceList.get(multipleChoiceList.size() - 1);
        assertThat(testMultipleChoice.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testMultipleChoice.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testMultipleChoice.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingMultipleChoice() throws Exception {
        int databaseSizeBeforeUpdate = multipleChoiceRepository.findAll().size();
        multipleChoice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMultipleChoiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, multipleChoice.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(multipleChoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MultipleChoice in the database
        List<MultipleChoice> multipleChoiceList = multipleChoiceRepository.findAll();
        assertThat(multipleChoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMultipleChoice() throws Exception {
        int databaseSizeBeforeUpdate = multipleChoiceRepository.findAll().size();
        multipleChoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMultipleChoiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(multipleChoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MultipleChoice in the database
        List<MultipleChoice> multipleChoiceList = multipleChoiceRepository.findAll();
        assertThat(multipleChoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMultipleChoice() throws Exception {
        int databaseSizeBeforeUpdate = multipleChoiceRepository.findAll().size();
        multipleChoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMultipleChoiceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(multipleChoice)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MultipleChoice in the database
        List<MultipleChoice> multipleChoiceList = multipleChoiceRepository.findAll();
        assertThat(multipleChoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMultipleChoiceWithPatch() throws Exception {
        // Initialize the database
        multipleChoiceRepository.saveAndFlush(multipleChoice);

        int databaseSizeBeforeUpdate = multipleChoiceRepository.findAll().size();

        // Update the multipleChoice using partial update
        MultipleChoice partialUpdatedMultipleChoice = new MultipleChoice();
        partialUpdatedMultipleChoice.setId(multipleChoice.getId());

        restMultipleChoiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMultipleChoice.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMultipleChoice))
            )
            .andExpect(status().isOk());

        // Validate the MultipleChoice in the database
        List<MultipleChoice> multipleChoiceList = multipleChoiceRepository.findAll();
        assertThat(multipleChoiceList).hasSize(databaseSizeBeforeUpdate);
        MultipleChoice testMultipleChoice = multipleChoiceList.get(multipleChoiceList.size() - 1);
        assertThat(testMultipleChoice.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testMultipleChoice.getImage()).isEqualTo(DEFAULT_IMAGE);
        assertThat(testMultipleChoice.getImageContentType()).isEqualTo(DEFAULT_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateMultipleChoiceWithPatch() throws Exception {
        // Initialize the database
        multipleChoiceRepository.saveAndFlush(multipleChoice);

        int databaseSizeBeforeUpdate = multipleChoiceRepository.findAll().size();

        // Update the multipleChoice using partial update
        MultipleChoice partialUpdatedMultipleChoice = new MultipleChoice();
        partialUpdatedMultipleChoice.setId(multipleChoice.getId());

        partialUpdatedMultipleChoice.status(UPDATED_STATUS).image(UPDATED_IMAGE).imageContentType(UPDATED_IMAGE_CONTENT_TYPE);

        restMultipleChoiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMultipleChoice.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMultipleChoice))
            )
            .andExpect(status().isOk());

        // Validate the MultipleChoice in the database
        List<MultipleChoice> multipleChoiceList = multipleChoiceRepository.findAll();
        assertThat(multipleChoiceList).hasSize(databaseSizeBeforeUpdate);
        MultipleChoice testMultipleChoice = multipleChoiceList.get(multipleChoiceList.size() - 1);
        assertThat(testMultipleChoice.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testMultipleChoice.getImage()).isEqualTo(UPDATED_IMAGE);
        assertThat(testMultipleChoice.getImageContentType()).isEqualTo(UPDATED_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingMultipleChoice() throws Exception {
        int databaseSizeBeforeUpdate = multipleChoiceRepository.findAll().size();
        multipleChoice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMultipleChoiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, multipleChoice.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(multipleChoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MultipleChoice in the database
        List<MultipleChoice> multipleChoiceList = multipleChoiceRepository.findAll();
        assertThat(multipleChoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMultipleChoice() throws Exception {
        int databaseSizeBeforeUpdate = multipleChoiceRepository.findAll().size();
        multipleChoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMultipleChoiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(multipleChoice))
            )
            .andExpect(status().isBadRequest());

        // Validate the MultipleChoice in the database
        List<MultipleChoice> multipleChoiceList = multipleChoiceRepository.findAll();
        assertThat(multipleChoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMultipleChoice() throws Exception {
        int databaseSizeBeforeUpdate = multipleChoiceRepository.findAll().size();
        multipleChoice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMultipleChoiceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(multipleChoice))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the MultipleChoice in the database
        List<MultipleChoice> multipleChoiceList = multipleChoiceRepository.findAll();
        assertThat(multipleChoiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMultipleChoice() throws Exception {
        // Initialize the database
        multipleChoiceRepository.saveAndFlush(multipleChoice);

        int databaseSizeBeforeDelete = multipleChoiceRepository.findAll().size();

        // Delete the multipleChoice
        restMultipleChoiceMockMvc
            .perform(delete(ENTITY_API_URL_ID, multipleChoice.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MultipleChoice> multipleChoiceList = multipleChoiceRepository.findAll();
        assertThat(multipleChoiceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
