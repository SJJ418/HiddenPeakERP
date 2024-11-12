package com.hiddenpeak.erp.dal.manager;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {
  int users;
  int activeUsers;
  int departments;
}
