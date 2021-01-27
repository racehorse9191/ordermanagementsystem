package com.oms.web.rest;

import com.oms.OrderManagementSystemApp;
import com.oms.domain.Menu;
import com.oms.repository.MenuRepository;

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
 * Integration tests for the {@link MenuResource} REST controller.
 */
@SpringBootTest(classes = OrderManagementSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class MenuResourceIT {

    private static final String DEFAULT_PRICE = "AAAAAAAAAA";
    private static final String UPDATED_PRICE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_AVAILABLE = false;
    private static final Boolean UPDATED_IS_AVAILABLE = true;

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMenuMockMvc;

    private Menu menu;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Menu createEntity(EntityManager em) {
        Menu menu = new Menu()
            .price(DEFAULT_PRICE)
            .isAvailable(DEFAULT_IS_AVAILABLE);
        return menu;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Menu createUpdatedEntity(EntityManager em) {
        Menu menu = new Menu()
            .price(UPDATED_PRICE)
            .isAvailable(UPDATED_IS_AVAILABLE);
        return menu;
    }

    @BeforeEach
    public void initTest() {
        menu = createEntity(em);
    }

    @Test
    @Transactional
    public void createMenu() throws Exception {
        int databaseSizeBeforeCreate = menuRepository.findAll().size();
        // Create the Menu
        restMenuMockMvc.perform(post("/api/menus")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(menu)))
            .andExpect(status().isCreated());

        // Validate the Menu in the database
        List<Menu> menuList = menuRepository.findAll();
        assertThat(menuList).hasSize(databaseSizeBeforeCreate + 1);
        Menu testMenu = menuList.get(menuList.size() - 1);
        assertThat(testMenu.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testMenu.isIsAvailable()).isEqualTo(DEFAULT_IS_AVAILABLE);
    }

    @Test
    @Transactional
    public void createMenuWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = menuRepository.findAll().size();

        // Create the Menu with an existing ID
        menu.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMenuMockMvc.perform(post("/api/menus")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(menu)))
            .andExpect(status().isBadRequest());

        // Validate the Menu in the database
        List<Menu> menuList = menuRepository.findAll();
        assertThat(menuList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkPriceIsRequired() throws Exception {
        int databaseSizeBeforeTest = menuRepository.findAll().size();
        // set the field null
        menu.setPrice(null);

        // Create the Menu, which fails.


        restMenuMockMvc.perform(post("/api/menus")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(menu)))
            .andExpect(status().isBadRequest());

        List<Menu> menuList = menuRepository.findAll();
        assertThat(menuList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllMenus() throws Exception {
        // Initialize the database
        menuRepository.saveAndFlush(menu);

        // Get all the menuList
        restMenuMockMvc.perform(get("/api/menus?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(menu.getId().intValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.[*].isAvailable").value(hasItem(DEFAULT_IS_AVAILABLE.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getMenu() throws Exception {
        // Initialize the database
        menuRepository.saveAndFlush(menu);

        // Get the menu
        restMenuMockMvc.perform(get("/api/menus/{id}", menu.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(menu.getId().intValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE))
            .andExpect(jsonPath("$.isAvailable").value(DEFAULT_IS_AVAILABLE.booleanValue()));
    }
    @Test
    @Transactional
    public void getNonExistingMenu() throws Exception {
        // Get the menu
        restMenuMockMvc.perform(get("/api/menus/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMenu() throws Exception {
        // Initialize the database
        menuRepository.saveAndFlush(menu);

        int databaseSizeBeforeUpdate = menuRepository.findAll().size();

        // Update the menu
        Menu updatedMenu = menuRepository.findById(menu.getId()).get();
        // Disconnect from session so that the updates on updatedMenu are not directly saved in db
        em.detach(updatedMenu);
        updatedMenu
            .price(UPDATED_PRICE)
            .isAvailable(UPDATED_IS_AVAILABLE);

        restMenuMockMvc.perform(put("/api/menus")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedMenu)))
            .andExpect(status().isOk());

        // Validate the Menu in the database
        List<Menu> menuList = menuRepository.findAll();
        assertThat(menuList).hasSize(databaseSizeBeforeUpdate);
        Menu testMenu = menuList.get(menuList.size() - 1);
        assertThat(testMenu.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testMenu.isIsAvailable()).isEqualTo(UPDATED_IS_AVAILABLE);
    }

    @Test
    @Transactional
    public void updateNonExistingMenu() throws Exception {
        int databaseSizeBeforeUpdate = menuRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMenuMockMvc.perform(put("/api/menus")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(menu)))
            .andExpect(status().isBadRequest());

        // Validate the Menu in the database
        List<Menu> menuList = menuRepository.findAll();
        assertThat(menuList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMenu() throws Exception {
        // Initialize the database
        menuRepository.saveAndFlush(menu);

        int databaseSizeBeforeDelete = menuRepository.findAll().size();

        // Delete the menu
        restMenuMockMvc.perform(delete("/api/menus/{id}", menu.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Menu> menuList = menuRepository.findAll();
        assertThat(menuList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
