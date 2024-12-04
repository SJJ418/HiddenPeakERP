package com.hiddenpeak.erp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vendor")
public class Vendor {
    @Id
    @Column(name = "orderId")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer vendorId;

    private String vendorName;

    public Integer getVendorId() {
        return vendorId;
    }

    public void setVendorId(Integer id) {
        this.vendorId = id;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String name) {
        this.vendorName = name;
    }
}
