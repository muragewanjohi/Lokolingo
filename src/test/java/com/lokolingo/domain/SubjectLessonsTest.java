package com.lokolingo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.lokolingo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SubjectLessonsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SubjectLessons.class);
        SubjectLessons subjectLessons1 = new SubjectLessons();
        subjectLessons1.setId(1L);
        SubjectLessons subjectLessons2 = new SubjectLessons();
        subjectLessons2.setId(subjectLessons1.getId());
        assertThat(subjectLessons1).isEqualTo(subjectLessons2);
        subjectLessons2.setId(2L);
        assertThat(subjectLessons1).isNotEqualTo(subjectLessons2);
        subjectLessons1.setId(null);
        assertThat(subjectLessons1).isNotEqualTo(subjectLessons2);
    }
}
