package com.hiddenpeak.erp;

import ch.qos.logback.classic.Logger;
import com.hiddenpeak.erp.dal.PurchaseOrder;
import com.hiddenpeak.erp.dal.User;
import com.hiddenpeak.erp.repository.PurchaseOrderRepository;
import com.hiddenpeak.erp.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Helper class to pre-populate database with test data
 */
@Component
@Slf4j
public class TestDataController {

  @Autowired
  private PurchaseOrderRepository purchaseOrderRepository;

  @Autowired
  private UserRepository userRepository;

  @EventListener({ApplicationStartedEvent.class})
  public void initializeDatabases() {
    log.info("Initializing database");
    initializeUserTable();
    initializePurchaseOrderTable();
  }

  private void initializeUserTable() {
    List<User> users = new ArrayList<>();
    users.add(new User("admin", "password", "Admin"));
    users.add(new User("operations", "password", "Ops Manager"));
    users.add(new User("production", "password", "Production"));
    users.add(new User("finance", "password", "Finance"));
    userRepository.saveAll(users);
  }

  private void initializePurchaseOrderTable() {
    List<PurchaseOrder> orders = new ArrayList<>();
    orders.add(new PurchaseOrder("Wooden Chair", "Steve Chiang", 10, "2025-01-01", 500, "10000"));
    orders.add(new PurchaseOrder("Wooden Desk", "Samy Attia", 4, "2025-01-02", 600, "20000"));
    orders.add(new PurchaseOrder("Wooden Bookshelf", "Stephen Jendritz", 6, "2025-01-03", 700, "30000"));
    purchaseOrderRepository.saveAll(orders);
  }

}
