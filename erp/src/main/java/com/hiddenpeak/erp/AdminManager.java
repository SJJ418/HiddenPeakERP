package com.hiddenpeak.erp;

import com.hiddenpeak.erp.dal.admin.DashboardStats;
import com.hiddenpeak.erp.entity.User;
import com.hiddenpeak.erp.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * manages user authentication and database
 */
@Component
public class AdminManager {

@Autowired
UserRepository userRepository;

  /**
   * Add a new User
   * @param user
   */
  public void addUser(User user) {
    userRepository.save(user);
  }

  /**
   * returns a matching User if its userId and password both match
   * @param userId
   * @param password
   * @return
   */
  public Optional<User> getUser(String userId, String password) {
    List<User> createdUsers = new ArrayList<>();
    userRepository.findAll().forEach(createdUsers::add);
    return createdUsers.stream()
        .filter(user ->
            (user.getUserId().equals(userId) && user.getUserPassword().equals(password))
        ).findFirst();
  }

  public DashboardStats getDashboardStats() {
    List<User> createdUsers = new ArrayList<>();
    userRepository.findAll().forEach(createdUsers::add);
    return new DashboardStats(createdUsers.size(), 1, createdUsers.size());
  }

}
