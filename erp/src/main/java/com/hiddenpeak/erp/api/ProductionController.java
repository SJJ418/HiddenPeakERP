package com.hiddenpeak.erp.api;

import com.hiddenpeak.erp.ProductionManager;
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

/**
 * REST API for the production.html page
 */
@RestController
@CrossOrigin
@Slf4j
public class ProductionController {

  @Autowired
  ProductionManager productionManager;

  @GetMapping("/api/production-data")
  public ResponseEntity getProductionData() {
    log.info("Retrieving Production Data");
    return ResponseEntity.ok(productionManager.getProductionData());
  }

  @PostMapping("/api/orders/process")
  public ResponseEntity processOrders(@RequestBody String data) {
    log.info("Processing Production Order");
    log.info("data: {}", data);

    JSONObject object = new JSONObject(data);
    int id = Integer.parseInt(object.getString("id"));
    productionManager.updateOrderStatus(id, "IN_PROGRESS");
    return new ResponseEntity(HttpStatus.OK);
  }

  @PostMapping("/api/orders/complete")
  public ResponseEntity completeOrder(@RequestBody String data) {
    log.info("Completing Production Order");
    log.info("data: {}", data);
    JSONObject object = new JSONObject(data);
    int id = Integer.parseInt(object.getString("id"));
    productionManager.updateOrderStatus(id, "COMPLETED");
    return new ResponseEntity(HttpStatus.OK);
  }

  @GetMapping("/api/orders/completed")
  public ResponseEntity getCompletedOrders() {
    log.info("Retrieving Completed Orders");
    return ResponseEntity.ok(productionManager.getCompletedOrders());
  }
}



