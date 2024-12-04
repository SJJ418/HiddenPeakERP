package com.hiddenpeak.erp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "permission")
public class Permission {
    @Id
    @Column(name = "permissionId")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer permissionId;

    private String permissionDescription;

    private String email;

    public Integer getId() {
        return permissionId;
    }

    public void setId(Integer id) {
        this.permissionId = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
