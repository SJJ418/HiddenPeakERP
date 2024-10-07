package com.hiddenpeak.erp.api;


import com.hiddenpeak.erp.ProductionManager;
import com.hiddenpeak.erp.dal.ProductionReport;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@Slf4j
public class ErpController {

  @Autowired
  ProductionManager productionManager;

@GetMapping("/test")
public void test() {
  System.out.println("Success!");
}

  @PostMapping("/createAccount")
  public void createAccount(@RequestBody String body) {
    System.out.println("createAccount hit");
    log.info("Got a request with body: {}", body);

    //productionManager.generateProductionReport(id);
  }

  @PostMapping("/login")
  public void login(@RequestBody String body) {
    System.out.println("login hit");

    log.info("Got a request with body: {}", body);
  }

  @PostMapping("/submitPurchaseOrder")
  public void submitPurchaseOrder(@RequestBody String id) {
    //productionManager.generateProductionReport(id);
  }

  @GetMapping("/getProductionReports")
  public List<ProductionReport> getProductionReports() {
    return productionManager.getProductionReports();
  }

}

