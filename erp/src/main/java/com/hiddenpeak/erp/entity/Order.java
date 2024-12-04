package com.hiddenpeak.erp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "order")
public class Order {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(name = "orderId")
    private Integer orderId;

    @ManyToOne
    @JoinColumn(name = "customerId")
    private Customer customer;

    @OneToOne
    @JoinColumn(name = "materialId")
    private Material material;

    private java.sql.Timestamp orderDate;

    private java.sql.Timestamp dueDate;

    public Integer getId() {
        return orderId;
    }

    public void setId(Integer id) {
        this.orderId = id;
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

    public String getMaterialId() {
        return orderDate;
    }

    public void setMaterialId(String materialId) {
        this.orderDate = orderDate;
    }

    public String getMaterialId() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }
}


