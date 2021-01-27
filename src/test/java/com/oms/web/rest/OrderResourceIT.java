package com.oms.web.rest;

import com.oms.OrderManagementSystemApp;
import com.oms.domain.Order;
import com.oms.repository.OrderRepository;

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
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.oms.domain.enumeration.OrderStatus;
/**
 * Integration tests for the {@link OrderResource} REST controller.
 */
@SpringBootTest(classes = OrderManagementSystemApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class OrderResourceIT {

    private static final String DEFAULT_MENU_IDSAND_QTY = "AAAAAAAAAA";
    private static final String UPDATED_MENU_IDSAND_QTY = "BBBBBBBBBB";

    private static final String DEFAULT_WAITER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_WAITER_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_NOTE = "AAAAAAAAAA";
    private static final String UPDATED_NOTE = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_ORDER_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_ORDER_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final OrderStatus DEFAULT_ORDERSTATUS = OrderStatus.CONFIRMED;
    private static final OrderStatus UPDATED_ORDERSTATUS = OrderStatus.BEING_PREPARED;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrderMockMvc;

    private Order order;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Order createEntity(EntityManager em) {
        Order order = new Order()
            .menuIdsandQty(DEFAULT_MENU_IDSAND_QTY)
            .waiterName(DEFAULT_WAITER_NAME)
            .note(DEFAULT_NOTE)
            .orderDate(DEFAULT_ORDER_DATE)
            .orderstatus(DEFAULT_ORDERSTATUS);
        return order;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Order createUpdatedEntity(EntityManager em) {
        Order order = new Order()
            .menuIdsandQty(UPDATED_MENU_IDSAND_QTY)
            .waiterName(UPDATED_WAITER_NAME)
            .note(UPDATED_NOTE)
            .orderDate(UPDATED_ORDER_DATE)
            .orderstatus(UPDATED_ORDERSTATUS);
        return order;
    }

    @BeforeEach
    public void initTest() {
        order = createEntity(em);
    }

    @Test
    @Transactional
    public void createOrder() throws Exception {
        int databaseSizeBeforeCreate = orderRepository.findAll().size();
        // Create the Order
        restOrderMockMvc.perform(post("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isCreated());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeCreate + 1);
        Order testOrder = orderList.get(orderList.size() - 1);
        assertThat(testOrder.getMenuIdsandQty()).isEqualTo(DEFAULT_MENU_IDSAND_QTY);
        assertThat(testOrder.getWaiterName()).isEqualTo(DEFAULT_WAITER_NAME);
        assertThat(testOrder.getNote()).isEqualTo(DEFAULT_NOTE);
        assertThat(testOrder.getOrderDate()).isEqualTo(DEFAULT_ORDER_DATE);
        assertThat(testOrder.getOrderstatus()).isEqualTo(DEFAULT_ORDERSTATUS);
    }

    @Test
    @Transactional
    public void createOrderWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = orderRepository.findAll().size();

        // Create the Order with an existing ID
        order.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrderMockMvc.perform(post("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isBadRequest());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkMenuIdsandQtyIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderRepository.findAll().size();
        // set the field null
        order.setMenuIdsandQty(null);

        // Create the Order, which fails.


        restOrderMockMvc.perform(post("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isBadRequest());

        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkWaiterNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = orderRepository.findAll().size();
        // set the field null
        order.setWaiterName(null);

        // Create the Order, which fails.


        restOrderMockMvc.perform(post("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isBadRequest());

        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllOrders() throws Exception {
        // Initialize the database
        orderRepository.saveAndFlush(order);

        // Get all the orderList
        restOrderMockMvc.perform(get("/api/orders?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(order.getId().intValue())))
            .andExpect(jsonPath("$.[*].menuIdsandQty").value(hasItem(DEFAULT_MENU_IDSAND_QTY)))
            .andExpect(jsonPath("$.[*].waiterName").value(hasItem(DEFAULT_WAITER_NAME)))
            .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE)))
            .andExpect(jsonPath("$.[*].orderDate").value(hasItem(DEFAULT_ORDER_DATE.toString())))
            .andExpect(jsonPath("$.[*].orderstatus").value(hasItem(DEFAULT_ORDERSTATUS.toString())));
    }
    
    @Test
    @Transactional
    public void getOrder() throws Exception {
        // Initialize the database
        orderRepository.saveAndFlush(order);

        // Get the order
        restOrderMockMvc.perform(get("/api/orders/{id}", order.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(order.getId().intValue()))
            .andExpect(jsonPath("$.menuIdsandQty").value(DEFAULT_MENU_IDSAND_QTY))
            .andExpect(jsonPath("$.waiterName").value(DEFAULT_WAITER_NAME))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE))
            .andExpect(jsonPath("$.orderDate").value(DEFAULT_ORDER_DATE.toString()))
            .andExpect(jsonPath("$.orderstatus").value(DEFAULT_ORDERSTATUS.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingOrder() throws Exception {
        // Get the order
        restOrderMockMvc.perform(get("/api/orders/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOrder() throws Exception {
        // Initialize the database
        orderRepository.saveAndFlush(order);

        int databaseSizeBeforeUpdate = orderRepository.findAll().size();

        // Update the order
        Order updatedOrder = orderRepository.findById(order.getId()).get();
        // Disconnect from session so that the updates on updatedOrder are not directly saved in db
        em.detach(updatedOrder);
        updatedOrder
            .menuIdsandQty(UPDATED_MENU_IDSAND_QTY)
            .waiterName(UPDATED_WAITER_NAME)
            .note(UPDATED_NOTE)
            .orderDate(UPDATED_ORDER_DATE)
            .orderstatus(UPDATED_ORDERSTATUS);

        restOrderMockMvc.perform(put("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedOrder)))
            .andExpect(status().isOk());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeUpdate);
        Order testOrder = orderList.get(orderList.size() - 1);
        assertThat(testOrder.getMenuIdsandQty()).isEqualTo(UPDATED_MENU_IDSAND_QTY);
        assertThat(testOrder.getWaiterName()).isEqualTo(UPDATED_WAITER_NAME);
        assertThat(testOrder.getNote()).isEqualTo(UPDATED_NOTE);
        assertThat(testOrder.getOrderDate()).isEqualTo(UPDATED_ORDER_DATE);
        assertThat(testOrder.getOrderstatus()).isEqualTo(UPDATED_ORDERSTATUS);
    }

    @Test
    @Transactional
    public void updateNonExistingOrder() throws Exception {
        int databaseSizeBeforeUpdate = orderRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrderMockMvc.perform(put("/api/orders")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(order)))
            .andExpect(status().isBadRequest());

        // Validate the Order in the database
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOrder() throws Exception {
        // Initialize the database
        orderRepository.saveAndFlush(order);

        int databaseSizeBeforeDelete = orderRepository.findAll().size();

        // Delete the order
        restOrderMockMvc.perform(delete("/api/orders/{id}", order.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Order> orderList = orderRepository.findAll();
        assertThat(orderList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
