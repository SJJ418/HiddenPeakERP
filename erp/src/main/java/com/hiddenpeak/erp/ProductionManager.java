package com.hiddenpeak.erp;

import com.hiddenpeak.erp.dal.PurchaseOrder;
import com.hiddenpeak.erp.dal.User;
import com.hiddenpeak.erp.dal.manager.DashboardData;
import com.hiddenpeak.erp.repository.PurchaseOrderRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProductionManager {

  @Autowired
  PurchaseOrderRepository purchaseOrderRepository;

  public void submitOrder(PurchaseOrder purchaseOrder) {
    purchaseOrderRepository.save(purchaseOrder);
  }

  /**
   * Query the database for all Orders
   * @return a List of all orders in the database
   */
  public List<PurchaseOrder> getAllOrders() {
    List<PurchaseOrder> purchaseOrders = new ArrayList<>();
    purchaseOrderRepository.findAll().forEach(purchaseOrders::add);
    return purchaseOrders;
  }

  public DashboardData getDashboardData() {
    return new DashboardData(getAllOrders().size(), 0, 0);
  }


}
