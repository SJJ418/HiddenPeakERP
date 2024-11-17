package com.hiddenpeak.erp.api;

import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@Slf4j
public class LoginController {

  List<String> createdUsers = new ArrayList<>();

  @PostMapping("/createAccount")
  public ResponseEntity createAccount(@RequestBody String body) {
    log.info("Got a createAccount request with body: {}", body);

    JSONObject object = new JSONObject(body);
    createdUsers.add(object.getString("userId"));

    return new ResponseEntity(HttpStatus.OK);
  }

  @PostMapping("/login")
  public ResponseEntity login(@RequestBody String body) {

    log.info("Got a login request with body: {}", body);

    JSONObject object = new JSONObject(body);
    if (createdUsers.contains(object.getString("userId"))) {
      log.error("User found");
      return new ResponseEntity(HttpStatus.OK);
    } else {
      log.error("User not found");
      return new ResponseEntity(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
