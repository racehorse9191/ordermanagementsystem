package com.oms.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;

import com.oms.domain.enumeration.OrderStatus;

/**
 * A Order.
 */
@Entity
@Table(name = "jhi_order")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "menu_idsand_qty", columnDefinition="LONGTEXT", nullable = false)
    private String menuIdsandQty;

    @NotNull
    @Column(name = "waiter_name", nullable = false)
    private String waiterName;

    @Column(name = "note")
    private String note;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "orderstatus")
    private OrderStatus orderstatus;

    @ManyToOne
    @JsonIgnoreProperties(value = "orders", allowSetters = true)
    private Menu menu;

    @ManyToOne
    @JsonIgnoreProperties(value = "orders", allowSetters = true)
    private Tables tables;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMenuIdsandQty() {
        return menuIdsandQty;
    }

    public Order menuIdsandQty(String menuIdsandQty) {
        this.menuIdsandQty = menuIdsandQty;
        return this;
    }

    public void setMenuIdsandQty(String menuIdsandQty) {
        this.menuIdsandQty = menuIdsandQty;
    }

    public String getWaiterName() {
        return waiterName;
    }

    public Order waiterName(String waiterName) {
        this.waiterName = waiterName;
        return this;
    }

    public void setWaiterName(String waiterName) {
        this.waiterName = waiterName;
    }

    public String getNote() {
        return note;
    }

    public Order note(String note) {
        this.note = note;
        return this;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public Order orderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
        return this;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public OrderStatus getOrderstatus() {
        return orderstatus;
    }

    public Order orderstatus(OrderStatus orderstatus) {
        this.orderstatus = orderstatus;
        return this;
    }

    public void setOrderstatus(OrderStatus orderstatus) {
        this.orderstatus = orderstatus;
    }

    public Menu getMenu() {
        return menu;
    }

    public Order menu(Menu menu) {
        this.menu = menu;
        return this;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }

    public Tables getTables() {
        return tables;
    }

    public Order tables(Tables tables) {
        this.tables = tables;
        return this;
    }

    public void setTables(Tables tables) {
        this.tables = tables;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Order)) {
            return false;
        }
        return id != null && id.equals(((Order) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Order{" +
            "id=" + getId() +
            ", menuIdsandQty='" + getMenuIdsandQty() + "'" +
            ", waiterName='" + getWaiterName() + "'" +
            ", note='" + getNote() + "'" +
            ", orderDate='" + getOrderDate() + "'" +
            ", orderstatus='" + getOrderstatus() + "'" +
            "}";
    }
}
