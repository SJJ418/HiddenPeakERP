package com.hiddenpeak.erp.api;

import com.hiddenpeak.erp.AdminManager;
import com.hiddenpeak.erp.ProductionManager;
import com.hiddenpeak.erp.dal.admin.DashboardStats;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@Slf4j
public class AdminController {

  @Autowired
  AdminManager adminManager;

  List<String> createdUsers = new ArrayList<>();

  @GetMapping("/api/dashboard-stats")
  public ResponseEntity getDashboardData() {
    log.info("Retrieving Dashboard Stats");
    return ResponseEntity.ok(adminManager.getDashboardStats());
  }

}

