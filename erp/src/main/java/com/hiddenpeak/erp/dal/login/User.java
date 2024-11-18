package com.hiddenpeak.erp.dal.login;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class User {
  String userId;
  String password;
  String role;
}
