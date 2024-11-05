package com.hiddenpeak.erp.api;

import com.hiddenpeak.erp.ProductionManager;
import com.hiddenpeak.erp.dal.manager.DashboardData;
import com.hiddenpeak.erp.dal.manager.Inventory;
import com.hiddenpeak.erp.dal.manager.Order;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@Slf4j
public class ManagerController {

  @Autowired
  ProductionManager productionManager;

  List<String> createdUsers = new ArrayList<>();

  @GetMapping("/api/dashboard-data")
  public ResponseEntity getDashboardData() {
    log.info("Retrieving Dashboard Data");
    return ResponseEntity.ok(new DashboardData(5, 10, 6));
  }
  @GetMapping("/api/orders")
  public ResponseEntity getOrders() {
    log.info("Retrieving Orders");
    List<Order> orders = new ArrayList<>();
    Order order1 = new Order(1, "Test Order", 5, "NEW", "testCategory", 5.00, "test Vendor");
    Order order2 = new Order(2, "Test Order", 6, "NEW", "testCategory", 15.00, "test Vendor");
    orders.add(order1);
    orders.add(order2);
    return ResponseEntity.ok(orders);
  }

  @GetMapping("/api/inventory")
  public ResponseEntity getInventory() {
    log.info("Retrieving Inventory");
    List<Inventory> inventories = new ArrayList<>();
    Inventory inventory1 = new Inventory(1, "Test Inventory", 5, "NEW", "testCategory", 10.00, "test Vendor");
    Inventory inventory2 = new Inventory(2, "Test Inventory", 6, "NEW", "testCategory", 20.00, "test Vendor");
    inventories.add(inventory1);
    inventories.add(inventory2);
    return ResponseEntity.ok(inventories);
  }
}

