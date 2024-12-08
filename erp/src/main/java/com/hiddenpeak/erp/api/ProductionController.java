package com.hiddenpeak.erp.api;

import com.hiddenpeak.erp.ProductionManager;
import com.hiddenpeak.erp.dal.PurchaseOrder;
import com.hiddenpeak.erp.dal.manager.Inventory;
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
public class ProductionController {

  @Autowired
  ProductionManager productionManager;

  @GetMapping("/api/production-data")
  public ResponseEntity getProductionData() {
    log.info("Retrieving Production Data");
    return ResponseEntity.ok(productionManager.getProductionData());
  }

}



