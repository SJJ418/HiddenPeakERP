package com.hiddenpeak.erp.api;

import com.hiddenpeak.erp.AdminManager;
import com.hiddenpeak.erp.dal.User;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST API for the welcome.html page
 */
@RestController
@CrossOrigin
@Slf4j
public class LoginController {

  @Autowired
  private AdminManager adminManager;

  @PostMapping("/createAccount")
  public ResponseEntity createAccount(@RequestBody String body) {
    log.info("Got a createAccount request with body: {}", body);

    JSONObject object = new JSONObject(body);
    String userId = object.getString("userId");
    String password = object.getString("password");
    String role = object.getString("role");
    adminManager.addUser(new User(userId, password, role));

    return new ResponseEntity(HttpStatus.OK);
  }

  @PostMapping("/login")
  public ResponseEntity login(@RequestBody String body) {

    log.info("Got a login request with body: {}", body);

    JSONObject object = new JSONObject(body);
    String userId = object.getString("userId");
    String password = object.getString("password");

    Optional<User> userOpt = adminManager.getUser(userId, password);

    if (userOpt.isPresent()) {
      log.info("user found!");
      return ResponseEntity.ok(userOpt.get());
    } else {
      log.error("User not found");
      return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}

