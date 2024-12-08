package com.hiddenpeak.erp.dal.production;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProductionData {
  int pendingOrders;
  int ordersInProduction;
  int completedOrders;
}
