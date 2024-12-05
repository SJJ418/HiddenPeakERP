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

    public Permission(Integer id, String description) {
        this.permissionId = id;
        this.permissionDescription = description;
    }

    public Integer getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(Integer id) {
        this.permissionId = id;
    }

    public String getPermissionDescription() {
        return permissionDescription;
    }

    public void setPermissionDescription(String description) {
        this.permissionDescription = description;
    }
}
