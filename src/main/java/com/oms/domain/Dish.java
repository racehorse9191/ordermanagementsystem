package com.oms.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import com.oms.domain.enumeration.Type;

/**
 * A Dish.
 */
@Entity
@Table(name = "dish")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Dish implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "dish_name", nullable = false)
    private String dishName;

    @Column(name = "dish_description")
    private String dishDescription;

    @Lob
    @Column(name = "dish_image")
    private byte[] dishImage;

    @Column(name = "dish_image_content_type")
    private String dishImageContentType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private Type type;

    @Column(name = "is_todays_special")
    private Boolean isTodaysSpecial;

    @OneToMany(mappedBy = "dish")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Menu> menus = new HashSet<>();

    @ManyToOne
    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnoreProperties(value = "dishes", allowSetters = true)
    private Category category;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDishName() {
        return dishName;
    }

    public Dish dishName(String dishName) {
        this.dishName = dishName;
        return this;
    }

    public void setDishName(String dishName) {
        this.dishName = dishName;
    }

    public String getDishDescription() {
        return dishDescription;
    }

    public Dish dishDescription(String dishDescription) {
        this.dishDescription = dishDescription;
        return this;
    }

    public void setDishDescription(String dishDescription) {
        this.dishDescription = dishDescription;
    }

    public byte[] getDishImage() {
        return dishImage;
    }

    public Dish dishImage(byte[] dishImage) {
        this.dishImage = dishImage;
        return this;
    }

    public void setDishImage(byte[] dishImage) {
        this.dishImage = dishImage;
    }

    public String getDishImageContentType() {
        return dishImageContentType;
    }

    public Dish dishImageContentType(String dishImageContentType) {
        this.dishImageContentType = dishImageContentType;
        return this;
    }

    public void setDishImageContentType(String dishImageContentType) {
        this.dishImageContentType = dishImageContentType;
    }

    public Type getType() {
        return type;
    }

    public Dish type(Type type) {
        this.type = type;
        return this;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Boolean isIsTodaysSpecial() {
        return isTodaysSpecial;
    }

    public Dish isTodaysSpecial(Boolean isTodaysSpecial) {
        this.isTodaysSpecial = isTodaysSpecial;
        return this;
    }

    public void setIsTodaysSpecial(Boolean isTodaysSpecial) {
        this.isTodaysSpecial = isTodaysSpecial;
    }

    public Set<Menu> getMenus() {
        return menus;
    }

    public Dish menus(Set<Menu> menus) {
        this.menus = menus;
        return this;
    }

    public Dish addMenu(Menu menu) {
        this.menus.add(menu);
        menu.setDish(this);
        return this;
    }

    public Dish removeMenu(Menu menu) {
        this.menus.remove(menu);
        menu.setDish(null);
        return this;
    }

    public void setMenus(Set<Menu> menus) {
        this.menus = menus;
    }

    public Category getCategory() {
        return category;
    }

    public Dish category(Category category) {
        this.category = category;
        return this;
    }

    public void setCategory(Category category) {
        this.category = category;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Dish)) {
            return false;
        }
        return id != null && id.equals(((Dish) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Dish{" +
            "id=" + getId() +
            ", dishName='" + getDishName() + "'" +
            ", dishDescription='" + getDishDescription() + "'" +
            ", dishImage='" + getDishImage() + "'" +
            ", dishImageContentType='" + getDishImageContentType() + "'" +
            ", type='" + getType() + "'" +
            ", isTodaysSpecial='" + isIsTodaysSpecial() + "'" +
            "}";
    }
}
