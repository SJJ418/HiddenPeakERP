package com.hiddenpeak.erp.entity;

import jakarta.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "user")
public class User {

    @Id
    @Column(name = "userId")
    private String userId;

    private String userPassword;

    private String role;

    public User(String userId, String password, String role) {
        this.userId = userId;
        this.userPassword = password;
        this.role = role;
    }

}
