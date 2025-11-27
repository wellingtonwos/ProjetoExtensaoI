package com.example.SpringBootApp.repositories;

import com.example.SpringBootApp.models.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    @Query("SELECT SUM(i.quantity) FROM Item i WHERE i.purchase.id = :purchaseId")
    BigDecimal sumQuantityByPurchaseId(@Param("purchaseId") Long purchaseId);

    List<Item> findByPurchaseIdAndProductId(Long purchaseId, Long productId);

		Item findFirstByPurchaseIdAndSaleIsNull(Long purchaseId);
}
