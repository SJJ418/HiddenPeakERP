package com.hiddenpeak.erp.api;

import com.hiddenpeak.erp.AdminManager;

import com.hiddenpeak.erp.dal.User;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API for the adminController.html page
 */
@RestController
@CrossOrigin
@Slf4j
public class AdminController {

  @Autowired
  AdminManager adminManager;

  @GetMapping("/api/dashboard-stats")
  public ResponseEntity getDashboardData() {
    log.info("Retrieving Dashboard Stats");
    return ResponseEntity.ok(adminManager.getDashboardStats());
  }

  @PostMapping("/api/users")
  public ResponseEntity addUser(@RequestBody String data) {
    log.info("Adding User");

    JSONObject object = new JSONObject(data);
    String userId = object.getString("userId");
    String password = object.getString("password");
    String role = object.getString("position");
    adminManager.addUser(new User(userId, password, role));

    return new ResponseEntity(HttpStatus.OK);
  }

  @GetMapping("/api/users")
  public ResponseEntity getUsers() {
    log.info("Get Users");
    return ResponseEntity.ok(adminManager.getAllUsers());
  }
}

