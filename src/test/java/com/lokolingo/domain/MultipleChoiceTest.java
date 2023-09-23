package com.lokolingo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.lokolingo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MultipleChoiceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MultipleChoice.class);
        MultipleChoice multipleChoice1 = new MultipleChoice();
        multipleChoice1.setId(1L);
        MultipleChoice multipleChoice2 = new MultipleChoice();
        multipleChoice2.setId(multipleChoice1.getId());
        assertThat(multipleChoice1).isEqualTo(multipleChoice2);
        multipleChoice2.setId(2L);
        assertThat(multipleChoice1).isNotEqualTo(multipleChoice2);
        multipleChoice1.setId(null);
        assertThat(multipleChoice1).isNotEqualTo(multipleChoice2);
    }
}
