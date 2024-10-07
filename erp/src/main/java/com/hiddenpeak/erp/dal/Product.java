package com.hiddenpeak.erp.dal;

import java.util.List;
import lombok.Data;
import lombok.NonNull;

@Data
public class Product {

  @NonNull private String name;
  List<String> materials;
}