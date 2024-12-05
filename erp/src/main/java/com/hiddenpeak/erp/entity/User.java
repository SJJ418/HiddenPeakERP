package com.hiddenpeak.erp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user")
public class User {
    @Id
    @Column(name = "userId")
    @GeneratedValue(strategy= GenerationType.AUTO)
    private String userId;

    private String userPassword;

    @OneToOne
    @JoinColumn(name = "permissionId")
    private Permission permission;

    public User(String id, String password, Permission pId) {
        this.userId = id;
        this.userPassword = password;
        this.permission = pId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String id) {
        this.userId = id;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String password) {
        this.userPassword = password;
    }
}
