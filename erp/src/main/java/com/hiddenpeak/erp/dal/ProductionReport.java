package com.hiddenpeak.erp.dal;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;

@Data
@AllArgsConstructor
public class ProductionReport {
  @NonNull private String name;
  List<Product> products;

  // code that calls the database
}