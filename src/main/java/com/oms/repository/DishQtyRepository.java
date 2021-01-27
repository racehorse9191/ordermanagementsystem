package com.oms.repository;

import com.oms.domain.DishQty;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the DishQty entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DishQtyRepository extends JpaRepository<DishQty, Long> {
}
