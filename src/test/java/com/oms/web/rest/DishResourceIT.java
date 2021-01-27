package com.oms.web.rest;

import com.oms.OrderManagementSystemApp;
import com.oms.domain.Dish;
import com.oms.repository.DishRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.oms.domain.enumeration.Type;
/**
 * Integration tests for the {@link DishResource} REST controller.
 */
@SpringBootTest(classes = OrderManagementSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class DishResourceIT {

    private static final String DEFAULT_DISH_NAME = "AAAAAAAAAA";
    private static final String UPDATED_DISH_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DISH_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DISH_DESCRIPTION = "BBBBBBBBBB";

    private static final byte[] DEFAULT_DISH_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_DISH_IMAGE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_DISH_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_DISH_IMAGE_CONTENT_TYPE = "image/png";

    private static final Type DEFAULT_TYPE = Type.VEG;
    private static final Type UPDATED_TYPE = Type.NON_VEG;

    private static final Boolean DEFAULT_IS_TODAYS_SPECIAL = false;
    private static final Boolean UPDATED_IS_TODAYS_SPECIAL = true;

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDishMockMvc;

    private Dish dish;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Dish createEntity(EntityManager em) {
        Dish dish = new Dish()
            .dishName(DEFAULT_DISH_NAME)
            .dishDescription(DEFAULT_DISH_DESCRIPTION)
            .dishImage(DEFAULT_DISH_IMAGE)
            .dishImageContentType(DEFAULT_DISH_IMAGE_CONTENT_TYPE)
            .type(DEFAULT_TYPE)
            .isTodaysSpecial(DEFAULT_IS_TODAYS_SPECIAL);
        return dish;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Dish createUpdatedEntity(EntityManager em) {
        Dish dish = new Dish()
            .dishName(UPDATED_DISH_NAME)
            .dishDescription(UPDATED_DISH_DESCRIPTION)
            .dishImage(UPDATED_DISH_IMAGE)
            .dishImageContentType(UPDATED_DISH_IMAGE_CONTENT_TYPE)
            .type(UPDATED_TYPE)
            .isTodaysSpecial(UPDATED_IS_TODAYS_SPECIAL);
        return dish;
    }

    @BeforeEach
    public void initTest() {
        dish = createEntity(em);
    }

    @Test
    @Transactional
    public void createDish() throws Exception {
        int databaseSizeBeforeCreate = dishRepository.findAll().size();
        // Create the Dish
        restDishMockMvc.perform(post("/api/dishes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(dish)))
            .andExpect(status().isCreated());

        // Validate the Dish in the database
        List<Dish> dishList = dishRepository.findAll();
        assertThat(dishList).hasSize(databaseSizeBeforeCreate + 1);
        Dish testDish = dishList.get(dishList.size() - 1);
        assertThat(testDish.getDishName()).isEqualTo(DEFAULT_DISH_NAME);
        assertThat(testDish.getDishDescription()).isEqualTo(DEFAULT_DISH_DESCRIPTION);
        assertThat(testDish.getDishImage()).isEqualTo(DEFAULT_DISH_IMAGE);
        assertThat(testDish.getDishImageContentType()).isEqualTo(DEFAULT_DISH_IMAGE_CONTENT_TYPE);
        assertThat(testDish.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testDish.isIsTodaysSpecial()).isEqualTo(DEFAULT_IS_TODAYS_SPECIAL);
    }

    @Test
    @Transactional
    public void createDishWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = dishRepository.findAll().size();

        // Create the Dish with an existing ID
        dish.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restDishMockMvc.perform(post("/api/dishes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(dish)))
            .andExpect(status().isBadRequest());

        // Validate the Dish in the database
        List<Dish> dishList = dishRepository.findAll();
        assertThat(dishList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkDishNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = dishRepository.findAll().size();
        // set the field null
        dish.setDishName(null);

        // Create the Dish, which fails.


        restDishMockMvc.perform(post("/api/dishes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(dish)))
            .andExpect(status().isBadRequest());

        List<Dish> dishList = dishRepository.findAll();
        assertThat(dishList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = dishRepository.findAll().size();
        // set the field null
        dish.setType(null);

        // Create the Dish, which fails.


        restDishMockMvc.perform(post("/api/dishes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(dish)))
            .andExpect(status().isBadRequest());

        List<Dish> dishList = dishRepository.findAll();
        assertThat(dishList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllDishes() throws Exception {
        // Initialize the database
        dishRepository.saveAndFlush(dish);

        // Get all the dishList
        restDishMockMvc.perform(get("/api/dishes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dish.getId().intValue())))
            .andExpect(jsonPath("$.[*].dishName").value(hasItem(DEFAULT_DISH_NAME)))
            .andExpect(jsonPath("$.[*].dishDescription").value(hasItem(DEFAULT_DISH_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].dishImageContentType").value(hasItem(DEFAULT_DISH_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].dishImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_DISH_IMAGE))))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].isTodaysSpecial").value(hasItem(DEFAULT_IS_TODAYS_SPECIAL.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getDish() throws Exception {
        // Initialize the database
        dishRepository.saveAndFlush(dish);

        // Get the dish
        restDishMockMvc.perform(get("/api/dishes/{id}", dish.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dish.getId().intValue()))
            .andExpect(jsonPath("$.dishName").value(DEFAULT_DISH_NAME))
            .andExpect(jsonPath("$.dishDescription").value(DEFAULT_DISH_DESCRIPTION))
            .andExpect(jsonPath("$.dishImageContentType").value(DEFAULT_DISH_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.dishImage").value(Base64Utils.encodeToString(DEFAULT_DISH_IMAGE)))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.isTodaysSpecial").value(DEFAULT_IS_TODAYS_SPECIAL.booleanValue()));
    }
    @Test
    @Transactional
    public void getNonExistingDish() throws Exception {
        // Get the dish
        restDishMockMvc.perform(get("/api/dishes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateDish() throws Exception {
        // Initialize the database
        dishRepository.saveAndFlush(dish);

        int databaseSizeBeforeUpdate = dishRepository.findAll().size();

        // Update the dish
        Dish updatedDish = dishRepository.findById(dish.getId()).get();
        // Disconnect from session so that the updates on updatedDish are not directly saved in db
        em.detach(updatedDish);
        updatedDish
            .dishName(UPDATED_DISH_NAME)
            .dishDescription(UPDATED_DISH_DESCRIPTION)
            .dishImage(UPDATED_DISH_IMAGE)
            .dishImageContentType(UPDATED_DISH_IMAGE_CONTENT_TYPE)
            .type(UPDATED_TYPE)
            .isTodaysSpecial(UPDATED_IS_TODAYS_SPECIAL);

        restDishMockMvc.perform(put("/api/dishes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedDish)))
            .andExpect(status().isOk());

        // Validate the Dish in the database
        List<Dish> dishList = dishRepository.findAll();
        assertThat(dishList).hasSize(databaseSizeBeforeUpdate);
        Dish testDish = dishList.get(dishList.size() - 1);
        assertThat(testDish.getDishName()).isEqualTo(UPDATED_DISH_NAME);
        assertThat(testDish.getDishDescription()).isEqualTo(UPDATED_DISH_DESCRIPTION);
        assertThat(testDish.getDishImage()).isEqualTo(UPDATED_DISH_IMAGE);
        assertThat(testDish.getDishImageContentType()).isEqualTo(UPDATED_DISH_IMAGE_CONTENT_TYPE);
        assertThat(testDish.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testDish.isIsTodaysSpecial()).isEqualTo(UPDATED_IS_TODAYS_SPECIAL);
    }

    @Test
    @Transactional
    public void updateNonExistingDish() throws Exception {
        int databaseSizeBeforeUpdate = dishRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDishMockMvc.perform(put("/api/dishes")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(dish)))
            .andExpect(status().isBadRequest());

        // Validate the Dish in the database
        List<Dish> dishList = dishRepository.findAll();
        assertThat(dishList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteDish() throws Exception {
        // Initialize the database
        dishRepository.saveAndFlush(dish);

        int databaseSizeBeforeDelete = dishRepository.findAll().size();

        // Delete the dish
        restDishMockMvc.perform(delete("/api/dishes/{id}", dish.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Dish> dishList = dishRepository.findAll();
        assertThat(dishList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
