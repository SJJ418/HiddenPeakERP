package com.hiddenpeak.erp.repository;

import com.hiddenpeak.erp.entity.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Integer> {

}
