package com.oms.web.rest;

import com.oms.OrderManagementSystemApp;
import com.oms.domain.DishQty;
import com.oms.repository.DishQtyRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link DishQtyResource} REST controller.
 */
@SpringBootTest(classes = OrderManagementSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class DishQtyResourceIT {

    private static final String DEFAULT_QTY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_QTY_NAME = "BBBBBBBBBB";

    @Autowired
    private DishQtyRepository dishQtyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDishQtyMockMvc;

    private DishQty dishQty;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DishQty createEntity(EntityManager em) {
        DishQty dishQty = new DishQty()
            .qtyName(DEFAULT_QTY_NAME);
        return dishQty;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static DishQty createUpdatedEntity(EntityManager em) {
        DishQty dishQty = new DishQty()
            .qtyName(UPDATED_QTY_NAME);
        return dishQty;
    }

    @BeforeEach
    public void initTest() {
        dishQty = createEntity(em);
    }

    @Test
    @Transactional
    public void createDishQty() throws Exception {
        int databaseSizeBeforeCreate = dishQtyRepository.findAll().size();
        // Create the DishQty
        restDishQtyMockMvc.perform(post("/api/dish-qties")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(dishQty)))
            .andExpect(status().isCreated());

        // Validate the DishQty in the database
        List<DishQty> dishQtyList = dishQtyRepository.findAll();
        assertThat(dishQtyList).hasSize(databaseSizeBeforeCreate + 1);
        DishQty testDishQty = dishQtyList.get(dishQtyList.size() - 1);
        assertThat(testDishQty.getQtyName()).isEqualTo(DEFAULT_QTY_NAME);
    }

    @Test
    @Transactional
    public void createDishQtyWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = dishQtyRepository.findAll().size();

        // Create the DishQty with an existing ID
        dishQty.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDishQtyMockMvc.perform(post("/api/dish-qties")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(dishQty)))
            .andExpect(status().isBadRequest());

        // Validate the DishQty in the database
        List<DishQty> dishQtyList = dishQtyRepository.findAll();
        assertThat(dishQtyList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkQtyNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = dishQtyRepository.findAll().size();
        // set the field null
        dishQty.setQtyName(null);

        // Create the DishQty, which fails.


        restDishQtyMockMvc.perform(post("/api/dish-qties")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(dishQty)))
            .andExpect(status().isBadRequest());

        List<DishQty> dishQtyList = dishQtyRepository.findAll();
        assertThat(dishQtyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDishQties() throws Exception {
        // Initialize the database
        dishQtyRepository.saveAndFlush(dishQty);

        // Get all the dishQtyList
        restDishQtyMockMvc.perform(get("/api/dish-qties?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dishQty.getId().intValue())))
            .andExpect(jsonPath("$.[*].qtyName").value(hasItem(DEFAULT_QTY_NAME)));
    }
    
    @Test
    @Transactional
    public void getDishQty() throws Exception {
        // Initialize the database
        dishQtyRepository.saveAndFlush(dishQty);

        // Get the dishQty
        restDishQtyMockMvc.perform(get("/api/dish-qties/{id}", dishQty.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dishQty.getId().intValue()))
            .andExpect(jsonPath("$.qtyName").value(DEFAULT_QTY_NAME));
    }
    @Test
    @Transactional
    public void getNonExistingDishQty() throws Exception {
        // Get the dishQty
        restDishQtyMockMvc.perform(get("/api/dish-qties/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDishQty() throws Exception {
        // Initialize the database
        dishQtyRepository.saveAndFlush(dishQty);

        int databaseSizeBeforeUpdate = dishQtyRepository.findAll().size();

        // Update the dishQty
        DishQty updatedDishQty = dishQtyRepository.findById(dishQty.getId()).get();
        // Disconnect from session so that the updates on updatedDishQty are not directly saved in db
        em.detach(updatedDishQty);
        updatedDishQty
            .qtyName(UPDATED_QTY_NAME);

        restDishQtyMockMvc.perform(put("/api/dish-qties")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedDishQty)))
            .andExpect(status().isOk());

        // Validate the DishQty in the database
        List<DishQty> dishQtyList = dishQtyRepository.findAll();
        assertThat(dishQtyList).hasSize(databaseSizeBeforeUpdate);
        DishQty testDishQty = dishQtyList.get(dishQtyList.size() - 1);
        assertThat(testDishQty.getQtyName()).isEqualTo(UPDATED_QTY_NAME);
    }

    @Test
    @Transactional
    public void updateNonExistingDishQty() throws Exception {
        int databaseSizeBeforeUpdate = dishQtyRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDishQtyMockMvc.perform(put("/api/dish-qties")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(dishQty)))
            .andExpect(status().isBadRequest());

        // Validate the DishQty in the database
        List<DishQty> dishQtyList = dishQtyRepository.findAll();
        assertThat(dishQtyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteDishQty() throws Exception {
        // Initialize the database
        dishQtyRepository.saveAndFlush(dishQty);

        int databaseSizeBeforeDelete = dishQtyRepository.findAll().size();

        // Delete the dishQty
        restDishQtyMockMvc.perform(delete("/api/dish-qties/{id}", dishQty.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<DishQty> dishQtyList = dishQtyRepository.findAll();
        assertThat(dishQtyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
