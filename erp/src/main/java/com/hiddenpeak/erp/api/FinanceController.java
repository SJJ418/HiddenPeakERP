package com.hiddenpeak.erp.api;

import com.hiddenpeak.erp.ProductionManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API for the finance.html page
 */
@RestController
@CrossOrigin
@Slf4j
public class FinanceController {

  @Autowired
  ProductionManager productionManager;

  @GetMapping("/api/finance-dashboard")
  public ResponseEntity getFinanceData() {
    log.info("Retrieving Finance Data");
    return ResponseEntity.ok(productionManager.getProductionData());
  }

  @GetMapping("/api/invoices")
  public ResponseEntity getInvoices() {
    log.info("Get Invoices");
    return new ResponseEntity(HttpStatus.OK);
  }

  @GetMapping("/api/payments")
  public ResponseEntity getPayments() {
    log.info("Get Payments");
    return new ResponseEntity(HttpStatus.OK);
  }

  @GetMapping("/api/reports")
  public ResponseEntity getReports() {
    log.info("Get Reports");
    return new ResponseEntity(HttpStatus.OK);
  }

}



