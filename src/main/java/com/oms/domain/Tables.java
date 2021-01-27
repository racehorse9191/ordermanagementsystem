package com.oms.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import com.oms.domain.enumeration.TableStatus;

/**
 * A Tables.
 */
@Entity
@Table(name = "tables")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Tables implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "table_name", nullable = false)
    private String tableName;

    @Enumerated(EnumType.STRING)
    @Column(name = "tablestatus")
    private TableStatus tablestatus;

    @OneToMany(mappedBy = "tables")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Order> orders = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTableName() {
        return tableName;
    }

    public Tables tableName(String tableName) {
        this.tableName = tableName;
        return this;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public TableStatus getTablestatus() {
        return tablestatus;
    }

    public Tables tablestatus(TableStatus tablestatus) {
        this.tablestatus = tablestatus;
        return this;
    }

    public void setTablestatus(TableStatus tablestatus) {
        this.tablestatus = tablestatus;
    }

    public Set<Order> getOrders() {
        return orders;
    }

    public Tables orders(Set<Order> orders) {
        this.orders = orders;
        return this;
    }

    public Tables addOrder(Order order) {
        this.orders.add(order);
        order.setTables(this);
        return this;
    }

    public Tables removeOrder(Order order) {
        this.orders.remove(order);
        order.setTables(null);
        return this;
    }

    public void setOrders(Set<Order> orders) {
        this.orders = orders;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tables)) {
            return false;
        }
        return id != null && id.equals(((Tables) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Tables{" +
            "id=" + getId() +
            ", tableName='" + getTableName() + "'" +
            ", tablestatus='" + getTablestatus() + "'" +
            "}";
    }
}
