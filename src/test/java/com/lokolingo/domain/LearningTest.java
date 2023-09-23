package com.lokolingo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.lokolingo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LearningTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Learning.class);
        Learning learning1 = new Learning();
        learning1.setId(1L);
        Learning learning2 = new Learning();
        learning2.setId(learning1.getId());
        assertThat(learning1).isEqualTo(learning2);
        learning2.setId(2L);
        assertThat(learning1).isNotEqualTo(learning2);
        learning1.setId(null);
        assertThat(learning1).isNotEqualTo(learning2);
    }
}
