package com.hiddenpeak.erp.dal.manager;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Order {
  int id;
  String name;
  int quantity;    // cost
  String status;
  int category;    // quantity
  String cost;     // date
  String vendor;   // delivery
}
