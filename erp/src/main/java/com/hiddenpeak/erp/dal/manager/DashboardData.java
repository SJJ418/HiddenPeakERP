package com.hiddenpeak.erp.dal.manager;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardData {
  int orders;
  int outOfStock;
  int ordersShipped;
}
