package com.hiddenpeak.erp;

import com.hiddenpeak.erp.entity.PurchaseOrder;
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

  public List<PurchaseOrder> getOrders() {
    List<PurchaseOrder> purchaseOrders = new ArrayList<>();
    purchaseOrderRepository.findAll().forEach(purchaseOrders::add);
    return purchaseOrders;
  }
}
