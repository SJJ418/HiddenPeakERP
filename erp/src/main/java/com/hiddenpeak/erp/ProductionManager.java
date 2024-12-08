package com.hiddenpeak.erp;

import com.hiddenpeak.erp.dal.PurchaseOrder;
import com.hiddenpeak.erp.dal.manager.DashboardData;
import com.hiddenpeak.erp.dal.production.ProductionData;
import com.hiddenpeak.erp.repository.PurchaseOrderRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Manages the interactions between the REST APIs and the PurchaseOrder database
 */
@Component
@Slf4j
public class ProductionManager {

  @Autowired
  PurchaseOrderRepository purchaseOrderRepository;

  /**
   * Saves a PurchaseOrder to the database
   * @param purchaseOrder the PurchaseOrder to save
   */
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

  /**
   * Get the manager data statistics
   * @return a DashboardData object containing order statistics
   */
  public DashboardData getDashboardData() {
    return new DashboardData(getAllOrders().size(), 0, 0);
  }

  /**
   * Get the production data statistics
   * @return a ProductionData object containing order statistics
   */
  public ProductionData getProductionData() {
    List<PurchaseOrder> purchaseOrders = getAllOrders();
    int pendingOrders = purchaseOrders.stream().filter(order -> order.getStatus().equals("PENDING")).toList().size();
    int inProgressOrders = purchaseOrders.stream().filter(order -> order.getStatus().equals("IN_PROGRESS")).toList().size();
    int completedOrders = purchaseOrders.stream().filter(order -> order.getStatus().equals("COMPLETED")).toList().size();
    return new ProductionData(pendingOrders, inProgressOrders, completedOrders);
  }

  /**
   * Update the Order matching a given order id with the desired status
   * @param id the id of the Order to update
   * @param desiredStatus the desired status
   */
  public void updateOrderStatus(int id, String desiredStatus) {
    // find id with matching order
    Optional<PurchaseOrder> purchaseOrderOpt = getAllOrders().stream().filter(order -> order.getOrderId().equals(id)).findFirst();
    if (purchaseOrderOpt.isEmpty()) {
      log.error("No Order found with id: {}", id);
      return;
    }
    PurchaseOrder purchaseOrder = purchaseOrderOpt.get();
    purchaseOrder.setStatus(desiredStatus);
    purchaseOrderRepository.save(purchaseOrder);
  }

  /**
   * Get all orders with a COMPLETED status
   * @return a list of COMPLETED orders
   */
  public List<PurchaseOrder> getCompletedOrders() {
    return getAllOrders().stream().filter(order -> order.getStatus().equals("COMPLETED")).toList();
  }
}
