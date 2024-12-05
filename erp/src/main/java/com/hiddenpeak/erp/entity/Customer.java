package com.hiddenpeak.erp.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "customer")
public class Customer {
    @Id
    @Column(name = "customerId")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer customerId;

    private String customerName;

    public Customer(Integer id, String name) {
        this.customerId = id;
        this.customerName = name;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer id) {
        this.customerId = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String name) {
        this.customerName = name;
    }
}
