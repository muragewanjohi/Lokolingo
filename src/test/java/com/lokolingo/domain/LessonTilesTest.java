package com.lokolingo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.lokolingo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LessonTilesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LessonTiles.class);
        LessonTiles lessonTiles1 = new LessonTiles();
        lessonTiles1.setId(1L);
        LessonTiles lessonTiles2 = new LessonTiles();
        lessonTiles2.setId(lessonTiles1.getId());
        assertThat(lessonTiles1).isEqualTo(lessonTiles2);
        lessonTiles2.setId(2L);
        assertThat(lessonTiles1).isNotEqualTo(lessonTiles2);
        lessonTiles1.setId(null);
        assertThat(lessonTiles1).isNotEqualTo(lessonTiles2);
    }
}
