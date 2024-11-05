package com.hiddenpeak.erp.dal.manager;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Order {
  int id;
  String name;
  int quantity;
  String status;
  String category;
  double cost;
  String vendor;
}
