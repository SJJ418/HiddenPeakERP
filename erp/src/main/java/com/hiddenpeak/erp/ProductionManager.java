package com.hiddenpeak.erp;

import com.hiddenpeak.erp.dal.ProductionReport;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
public class ProductionManager {

  @Getter private List<ProductionReport> productionReports = new ArrayList<>();

  /**
   * Generates a ProductionReport for a purchase order
   *
   */
  void generateProductionReport(String purchaseOrder) {



  }

}
