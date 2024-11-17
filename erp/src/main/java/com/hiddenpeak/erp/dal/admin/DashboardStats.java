package com.hiddenpeak.erp.dal.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStats {
  int users;
  int activeUsers;
  int departments;
}
