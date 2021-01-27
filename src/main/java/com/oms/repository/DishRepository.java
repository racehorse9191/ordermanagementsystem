package com.oms.repository;

import com.oms.domain.Dish;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Dish entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
}
