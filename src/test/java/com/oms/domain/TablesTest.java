package com.oms.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.oms.web.rest.TestUtil;

public class TablesTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Tables.class);
        Tables tables1 = new Tables();
        tables1.setId(1L);
        Tables tables2 = new Tables();
        tables2.setId(tables1.getId());
        assertThat(tables1).isEqualTo(tables2);
        tables2.setId(2L);
        assertThat(tables1).isNotEqualTo(tables2);
        tables1.setId(null);
        assertThat(tables1).isNotEqualTo(tables2);
    }
}
