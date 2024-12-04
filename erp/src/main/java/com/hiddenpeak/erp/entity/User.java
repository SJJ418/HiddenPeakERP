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
    private Permission permissionId;

    public Integer getId() {
        return orderId;
    }

    public void setId(Integer id) {
        this.orderId = userId;
    }

    public String getName() {
        return customerId;
    }

    public void setName(String name) {
        this.customerId = name;
    }

    public String getMaterialId() {
        return materialId;
    }

    public void setMaterialId(String materialId) {
        this.materialId = materialId;
    }


}
