package com.hiddenpeak.erp.api;

import com.hiddenpeak.erp.ProductionManager;
import com.hiddenpeak.erp.dal.manager.DashboardData;
import com.hiddenpeak.erp.dal.manager.Inventory;
import com.hiddenpeak.erp.dal.manager.Order;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@Slf4j
public class ManagerController {

  @Autowired
  ProductionManager productionManager;

  List<String> createdUsers = new ArrayList<>();

  List<Order> orders = new ArrayList<>();

  @GetMapping("/api/dashboard-data")
  public ResponseEntity getDashboardData() {
    log.info("Retrieving Dashboard Data");
    return ResponseEntity.ok(new DashboardData(5, 10, 6));
  }

  @GetMapping("/api/orders")
  public ResponseEntity getOrders() {
    log.info("Retrieving Orders");
    return ResponseEntity.ok(orders);
  }

  @PostMapping("/api/addOrder")
  public ResponseEntity addOrder(@RequestBody String data) {
    log.info("Adding Orders");

    log.info("got data: {}", data);

    JSONObject object = new JSONObject(data);

    int id = orders.size() + 1;
    String customerFirstName = object.getString("customerFirstName");
    String customerLastName = object.getString("customerLastName");
    int cost = Integer.parseInt(object.getString("cost"));
    int quantity = Integer.parseInt(object.getString("quantity"));
    String date = object.getString("completionDate");
    String zip = object.getString("zip");

    Order order = new Order(id, customerFirstName + " " + customerLastName, cost, "NEW", quantity, date, zip);

    orders.add(order);

    return new ResponseEntity(HttpStatus.OK);
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



