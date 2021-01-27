package com.oms.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A DishQty.
 */
@Entity
@Table(name = "dish_qty")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class DishQty implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "qty_name", nullable = false)
    private String qtyName;

    @OneToMany(mappedBy = "dishQty")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Menu> menus = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQtyName() {
        return qtyName;
    }

    public DishQty qtyName(String qtyName) {
        this.qtyName = qtyName;
        return this;
    }

    public void setQtyName(String qtyName) {
        this.qtyName = qtyName;
    }

    public Set<Menu> getMenus() {
        return menus;
    }

    public DishQty menus(Set<Menu> menus) {
        this.menus = menus;
        return this;
    }

    public DishQty addMenu(Menu menu) {
        this.menus.add(menu);
        menu.setDishQty(this);
        return this;
    }

    public DishQty removeMenu(Menu menu) {
        this.menus.remove(menu);
        menu.setDishQty(null);
        return this;
    }

    public void setMenus(Set<Menu> menus) {
        this.menus = menus;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DishQty)) {
            return false;
        }
        return id != null && id.equals(((DishQty) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DishQty{" +
            "id=" + getId() +
            ", qtyName='" + getQtyName() + "'" +
            "}";
    }
}
