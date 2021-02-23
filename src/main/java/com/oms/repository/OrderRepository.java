package com.oms.repository;

import com.oms.domain.Order;
import com.oms.domain.enumeration.OrderStatus;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Order entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
	public List<Order> findByOrderstatus(OrderStatus orderStatus);
	public Page<Order> findByWaiterName(String waiterName,Pageable pageable);
	
}
