package com.oms.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.oms.web.rest.TestUtil;

public class DishQtyTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DishQty.class);
        DishQty dishQty1 = new DishQty();
        dishQty1.setId(1L);
        DishQty dishQty2 = new DishQty();
        dishQty2.setId(dishQty1.getId());
        assertThat(dishQty1).isEqualTo(dishQty2);
        dishQty2.setId(2L);
        assertThat(dishQty1).isNotEqualTo(dishQty2);
        dishQty1.setId(null);
        assertThat(dishQty1).isNotEqualTo(dishQty2);
    }
}
