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

  List<Order> orders = new ArrayList<>();

  List<Inventory> inventories = new ArrayList<>();

  @GetMapping("/api/dashboard-data")
  public ResponseEntity getDashboardData() {
    log.info("Retrieving Dashboard Data");
    return ResponseEntity.ok(new DashboardData(5, 10, 6));
  }

  @PostMapping("/api/addOrder")
  public ResponseEntity addOrder(@RequestBody String data) {
    log.info("Adding Orders");

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

  @GetMapping("/api/orders")
  public ResponseEntity getOrders() {
    log.info("Retrieving Orders");
    return ResponseEntity.ok(orders);
  }

  @PostMapping("/api/addInventory")
  public ResponseEntity addInventory(@RequestBody String data) {
    log.info("Adding Inventory");
    log.info("got data: {}", data);

    JSONObject object = new JSONObject(data);
    int id = inventories.size() + 1;
    String itemName = object.getString("itemName");
    int quantity = Integer.parseInt(object.getString("quantity"));
    String category = object.getString("category");
    double cost = Double.parseDouble(object.getString("cost"));
    String vendorName = object.getString("vendorName");
    String inventoryDate = object.getString("inventoryDate");


    Inventory inventory = new Inventory(id, itemName, quantity, "NEW", category, cost, vendorName, inventoryDate);

    inventories.add(inventory);

    return new ResponseEntity(HttpStatus.OK);
  }


  @GetMapping("/api/inventory")
  public ResponseEntity getInventory() {
    log.info("Retrieving Inventory");
    return ResponseEntity.ok(inventories);
  }
}



