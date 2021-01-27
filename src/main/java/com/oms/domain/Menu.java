package com.oms.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Menu.
 */
@Entity
@Table(name = "menu")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Menu implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "price", nullable = false)
    private String price;

    @Column(name = "is_available")
    private Boolean isAvailable;

    @OneToMany(mappedBy = "menu")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Order> orders = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = "menus", allowSetters = true)
    private Dish dish;

    @ManyToOne
    @JsonIgnoreProperties(value = "menus", allowSetters = true)
    private DishQty dishQty;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPrice() {
        return price;
    }

    public Menu price(String price) {
        this.price = price;
        return this;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public Boolean isIsAvailable() {
        return isAvailable;
    }

    public Menu isAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
        return this;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public Set<Order> getOrders() {
        return orders;
    }

    public Menu orders(Set<Order> orders) {
        this.orders = orders;
        return this;
    }

    public Menu addOrder(Order order) {
        this.orders.add(order);
        order.setMenu(this);
        return this;
    }

    public Menu removeOrder(Order order) {
        this.orders.remove(order);
        order.setMenu(null);
        return this;
    }

    public void setOrders(Set<Order> orders) {
        this.orders = orders;
    }

    public Dish getDish() {
        return dish;
    }

    public Menu dish(Dish dish) {
        this.dish = dish;
        return this;
    }

    public void setDish(Dish dish) {
        this.dish = dish;
    }

    public DishQty getDishQty() {
        return dishQty;
    }

    public Menu dishQty(DishQty dishQty) {
        this.dishQty = dishQty;
        return this;
    }

    public void setDishQty(DishQty dishQty) {
        this.dishQty = dishQty;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Menu)) {
            return false;
        }
        return id != null && id.equals(((Menu) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Menu{" +
            "id=" + getId() +
            ", price='" + getPrice() + "'" +
            ", isAvailable='" + isIsAvailable() + "'" +
            "}";
    }
}
