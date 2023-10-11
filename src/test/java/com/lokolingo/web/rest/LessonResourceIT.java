package com.lokolingo.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.lokolingo.IntegrationTest;
import com.lokolingo.domain.Lesson;
import com.lokolingo.domain.enumeration.Language;
import com.lokolingo.domain.enumeration.Level;
import com.lokolingo.repository.LessonRepository;
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
 * Integration tests for the {@link LessonResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LessonResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final Language DEFAULT_LANGUAGE = Language.KIKUYU;
    private static final Language UPDATED_LANGUAGE = Language.ENGLISH;

    private static final Level DEFAULT_LEVEL = Level.BEGINNER;
    private static final Level UPDATED_LEVEL = Level.JUNIOR;

    private static final String ENTITY_API_URL = "/api/lessons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLessonMockMvc;

    private Lesson lesson;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Lesson createEntity(EntityManager em) {
        Lesson lesson = new Lesson().title(DEFAULT_TITLE).language(DEFAULT_LANGUAGE).level(DEFAULT_LEVEL);
        return lesson;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Lesson createUpdatedEntity(EntityManager em) {
        Lesson lesson = new Lesson().title(UPDATED_TITLE).language(UPDATED_LANGUAGE).level(UPDATED_LEVEL);
        return lesson;
    }

    @BeforeEach
    public void initTest() {
        lesson = createEntity(em);
    }

    @Test
    @Transactional
    void createLesson() throws Exception {
        int databaseSizeBeforeCreate = lessonRepository.findAll().size();
        // Create the Lesson
        restLessonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lesson)))
            .andExpect(status().isCreated());

        // Validate the Lesson in the database
        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeCreate + 1);
        Lesson testLesson = lessonList.get(lessonList.size() - 1);
        assertThat(testLesson.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testLesson.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
        assertThat(testLesson.getLevel()).isEqualTo(DEFAULT_LEVEL);
    }

    @Test
    @Transactional
    void createLessonWithExistingId() throws Exception {
        // Create the Lesson with an existing ID
        lesson.setId(1L);

        int databaseSizeBeforeCreate = lessonRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLessonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lesson)))
            .andExpect(status().isBadRequest());

        // Validate the Lesson in the database
        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = lessonRepository.findAll().size();
        // set the field null
        lesson.setTitle(null);

        // Create the Lesson, which fails.

        restLessonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lesson)))
            .andExpect(status().isBadRequest());

        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLanguageIsRequired() throws Exception {
        int databaseSizeBeforeTest = lessonRepository.findAll().size();
        // set the field null
        lesson.setLanguage(null);

        // Create the Lesson, which fails.

        restLessonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lesson)))
            .andExpect(status().isBadRequest());

        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLevelIsRequired() throws Exception {
        int databaseSizeBeforeTest = lessonRepository.findAll().size();
        // set the field null
        lesson.setLevel(null);

        // Create the Lesson, which fails.

        restLessonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lesson)))
            .andExpect(status().isBadRequest());

        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLessons() throws Exception {
        // Initialize the database
        lessonRepository.saveAndFlush(lesson);

        // Get all the lessonList
        restLessonMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(lesson.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].language").value(hasItem(DEFAULT_LANGUAGE.toString())))
            .andExpect(jsonPath("$.[*].level").value(hasItem(DEFAULT_LEVEL.toString())));
    }

    @Test
    @Transactional
    void getLesson() throws Exception {
        // Initialize the database
        lessonRepository.saveAndFlush(lesson);

        // Get the lesson
        restLessonMockMvc
            .perform(get(ENTITY_API_URL_ID, lesson.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(lesson.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.language").value(DEFAULT_LANGUAGE.toString()))
            .andExpect(jsonPath("$.level").value(DEFAULT_LEVEL.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLesson() throws Exception {
        // Get the lesson
        restLessonMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLesson() throws Exception {
        // Initialize the database
        lessonRepository.saveAndFlush(lesson);

        int databaseSizeBeforeUpdate = lessonRepository.findAll().size();

        // Update the lesson
        Lesson updatedLesson = lessonRepository.findById(lesson.getId()).get();
        // Disconnect from session so that the updates on updatedLesson are not directly saved in db
        em.detach(updatedLesson);
        updatedLesson.title(UPDATED_TITLE).language(UPDATED_LANGUAGE).level(UPDATED_LEVEL);

        restLessonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLesson.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLesson))
            )
            .andExpect(status().isOk());

        // Validate the Lesson in the database
        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeUpdate);
        Lesson testLesson = lessonList.get(lessonList.size() - 1);
        assertThat(testLesson.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testLesson.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
        assertThat(testLesson.getLevel()).isEqualTo(UPDATED_LEVEL);
    }

    @Test
    @Transactional
    void putNonExistingLesson() throws Exception {
        int databaseSizeBeforeUpdate = lessonRepository.findAll().size();
        lesson.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLessonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, lesson.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lesson))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lesson in the database
        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLesson() throws Exception {
        int databaseSizeBeforeUpdate = lessonRepository.findAll().size();
        lesson.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLessonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(lesson))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lesson in the database
        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLesson() throws Exception {
        int databaseSizeBeforeUpdate = lessonRepository.findAll().size();
        lesson.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLessonMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(lesson)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Lesson in the database
        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLessonWithPatch() throws Exception {
        // Initialize the database
        lessonRepository.saveAndFlush(lesson);

        int databaseSizeBeforeUpdate = lessonRepository.findAll().size();

        // Update the lesson using partial update
        Lesson partialUpdatedLesson = new Lesson();
        partialUpdatedLesson.setId(lesson.getId());

        restLessonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLesson.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLesson))
            )
            .andExpect(status().isOk());

        // Validate the Lesson in the database
        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeUpdate);
        Lesson testLesson = lessonList.get(lessonList.size() - 1);
        assertThat(testLesson.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testLesson.getLanguage()).isEqualTo(DEFAULT_LANGUAGE);
        assertThat(testLesson.getLevel()).isEqualTo(DEFAULT_LEVEL);
    }

    @Test
    @Transactional
    void fullUpdateLessonWithPatch() throws Exception {
        // Initialize the database
        lessonRepository.saveAndFlush(lesson);

        int databaseSizeBeforeUpdate = lessonRepository.findAll().size();

        // Update the lesson using partial update
        Lesson partialUpdatedLesson = new Lesson();
        partialUpdatedLesson.setId(lesson.getId());

        partialUpdatedLesson.title(UPDATED_TITLE).language(UPDATED_LANGUAGE).level(UPDATED_LEVEL);

        restLessonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLesson.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLesson))
            )
            .andExpect(status().isOk());

        // Validate the Lesson in the database
        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeUpdate);
        Lesson testLesson = lessonList.get(lessonList.size() - 1);
        assertThat(testLesson.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testLesson.getLanguage()).isEqualTo(UPDATED_LANGUAGE);
        assertThat(testLesson.getLevel()).isEqualTo(UPDATED_LEVEL);
    }

    @Test
    @Transactional
    void patchNonExistingLesson() throws Exception {
        int databaseSizeBeforeUpdate = lessonRepository.findAll().size();
        lesson.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLessonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, lesson.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lesson))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lesson in the database
        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLesson() throws Exception {
        int databaseSizeBeforeUpdate = lessonRepository.findAll().size();
        lesson.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLessonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(lesson))
            )
            .andExpect(status().isBadRequest());

        // Validate the Lesson in the database
        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLesson() throws Exception {
        int databaseSizeBeforeUpdate = lessonRepository.findAll().size();
        lesson.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLessonMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(lesson)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Lesson in the database
        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLesson() throws Exception {
        // Initialize the database
        lessonRepository.saveAndFlush(lesson);

        int databaseSizeBeforeDelete = lessonRepository.findAll().size();

        // Delete the lesson
        restLessonMockMvc
            .perform(delete(ENTITY_API_URL_ID, lesson.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Lesson> lessonList = lessonRepository.findAll();
        assertThat(lessonList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
