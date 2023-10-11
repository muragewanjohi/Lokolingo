package com.lokolingo.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.lokolingo.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ChildLearningsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChildLearnings.class);
        ChildLearnings childLearnings1 = new ChildLearnings();
        childLearnings1.setId(1L);
        ChildLearnings childLearnings2 = new ChildLearnings();
        childLearnings2.setId(childLearnings1.getId());
        assertThat(childLearnings1).isEqualTo(childLearnings2);
        childLearnings2.setId(2L);
        assertThat(childLearnings1).isNotEqualTo(childLearnings2);
        childLearnings1.setId(null);
        assertThat(childLearnings1).isNotEqualTo(childLearnings2);
    }
}
