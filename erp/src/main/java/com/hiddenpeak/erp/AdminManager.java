package com.hiddenpeak.erp;

import com.hiddenpeak.erp.dal.ProductionReport;
import com.hiddenpeak.erp.dal.login.User;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.Getter;
import org.springframework.stereotype.Component;

/**
 * manages user authentication and database
 */
@Component
public class AdminManager {

  @Getter
  private List<User> createdUsers = new ArrayList<>();

  /**
   * Add a new User
   * @param user
   */
  public void addUser(User user) {
    createdUsers.add(user);
  }

  /**
   * returns a matching User if its userId and password both match
   * @param userId
   * @param password
   * @return
   */
  public Optional<User> getUser(String userId, String password) {
    return createdUsers.stream()
        .filter(user ->
            (user.getUserId().equals(userId) && user.getPassword().equals(password))
        ).findFirst();
  }

}
