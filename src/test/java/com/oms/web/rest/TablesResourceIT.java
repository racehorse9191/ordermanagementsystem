package com.oms.web.rest;

import com.oms.OrderManagementSystemApp;
import com.oms.domain.Tables;
import com.oms.repository.TablesRepository;

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

import com.oms.domain.enumeration.TableStatus;
/**
 * Integration tests for the {@link TablesResource} REST controller.
 */
@SpringBootTest(classes = OrderManagementSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class TablesResourceIT {

    private static final String DEFAULT_TABLE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_TABLE_NAME = "BBBBBBBBBB";

    private static final TableStatus DEFAULT_TABLESTATUS = TableStatus.RESERVED;
    private static final TableStatus UPDATED_TABLESTATUS = TableStatus.ENGAGED;

    @Autowired
    private TablesRepository tablesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTablesMockMvc;

    private Tables tables;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tables createEntity(EntityManager em) {
        Tables tables = new Tables()
            .tableName(DEFAULT_TABLE_NAME)
            .tablestatus(DEFAULT_TABLESTATUS);
        return tables;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tables createUpdatedEntity(EntityManager em) {
        Tables tables = new Tables()
            .tableName(UPDATED_TABLE_NAME)
            .tablestatus(UPDATED_TABLESTATUS);
        return tables;
    }

    @BeforeEach
    public void initTest() {
        tables = createEntity(em);
    }

    @Test
    @Transactional
    public void createTables() throws Exception {
        int databaseSizeBeforeCreate = tablesRepository.findAll().size();
        // Create the Tables
        restTablesMockMvc.perform(post("/api/tables")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tables)))
            .andExpect(status().isCreated());

        // Validate the Tables in the database
        List<Tables> tablesList = tablesRepository.findAll();
        assertThat(tablesList).hasSize(databaseSizeBeforeCreate + 1);
        Tables testTables = tablesList.get(tablesList.size() - 1);
        assertThat(testTables.getTableName()).isEqualTo(DEFAULT_TABLE_NAME);
        assertThat(testTables.getTablestatus()).isEqualTo(DEFAULT_TABLESTATUS);
    }

    @Test
    @Transactional
    public void createTablesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tablesRepository.findAll().size();

        // Create the Tables with an existing ID
        tables.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTablesMockMvc.perform(post("/api/tables")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tables)))
            .andExpect(status().isBadRequest());

        // Validate the Tables in the database
        List<Tables> tablesList = tablesRepository.findAll();
        assertThat(tablesList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkTableNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = tablesRepository.findAll().size();
        // set the field null
        tables.setTableName(null);

        // Create the Tables, which fails.


        restTablesMockMvc.perform(post("/api/tables")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tables)))
            .andExpect(status().isBadRequest());

        List<Tables> tablesList = tablesRepository.findAll();
        assertThat(tablesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTables() throws Exception {
        // Initialize the database
        tablesRepository.saveAndFlush(tables);

        // Get all the tablesList
        restTablesMockMvc.perform(get("/api/tables?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tables.getId().intValue())))
            .andExpect(jsonPath("$.[*].tableName").value(hasItem(DEFAULT_TABLE_NAME)))
            .andExpect(jsonPath("$.[*].tablestatus").value(hasItem(DEFAULT_TABLESTATUS.toString())));
    }
    
    @Test
    @Transactional
    public void getTables() throws Exception {
        // Initialize the database
        tablesRepository.saveAndFlush(tables);

        // Get the tables
        restTablesMockMvc.perform(get("/api/tables/{id}", tables.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tables.getId().intValue()))
            .andExpect(jsonPath("$.tableName").value(DEFAULT_TABLE_NAME))
            .andExpect(jsonPath("$.tablestatus").value(DEFAULT_TABLESTATUS.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingTables() throws Exception {
        // Get the tables
        restTablesMockMvc.perform(get("/api/tables/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTables() throws Exception {
        // Initialize the database
        tablesRepository.saveAndFlush(tables);

        int databaseSizeBeforeUpdate = tablesRepository.findAll().size();

        // Update the tables
        Tables updatedTables = tablesRepository.findById(tables.getId()).get();
        // Disconnect from session so that the updates on updatedTables are not directly saved in db
        em.detach(updatedTables);
        updatedTables
            .tableName(UPDATED_TABLE_NAME)
            .tablestatus(UPDATED_TABLESTATUS);

        restTablesMockMvc.perform(put("/api/tables")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedTables)))
            .andExpect(status().isOk());

        // Validate the Tables in the database
        List<Tables> tablesList = tablesRepository.findAll();
        assertThat(tablesList).hasSize(databaseSizeBeforeUpdate);
        Tables testTables = tablesList.get(tablesList.size() - 1);
        assertThat(testTables.getTableName()).isEqualTo(UPDATED_TABLE_NAME);
        assertThat(testTables.getTablestatus()).isEqualTo(UPDATED_TABLESTATUS);
    }

    @Test
    @Transactional
    public void updateNonExistingTables() throws Exception {
        int databaseSizeBeforeUpdate = tablesRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTablesMockMvc.perform(put("/api/tables")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tables)))
            .andExpect(status().isBadRequest());

        // Validate the Tables in the database
        List<Tables> tablesList = tablesRepository.findAll();
        assertThat(tablesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTables() throws Exception {
        // Initialize the database
        tablesRepository.saveAndFlush(tables);

        int databaseSizeBeforeDelete = tablesRepository.findAll().size();

        // Delete the tables
        restTablesMockMvc.perform(delete("/api/tables/{id}", tables.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Tables> tablesList = tablesRepository.findAll();
        assertThat(tablesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
