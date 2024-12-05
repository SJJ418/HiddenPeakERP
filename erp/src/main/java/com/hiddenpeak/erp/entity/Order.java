package com.hiddenpeak.erp.entity;

import jakarta.persistence.*;

import java.sql.Time;
import java.sql.Timestamp;

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

    private Timestamp orderDate;

    private Timestamp dueDate;

    public Order(Integer id, Customer cId, Material mId, Timestamp oDate, Timestamp dDate) {
        this.orderId = id;
        this.customer = cId;
        this.material = mId;
        this.orderDate = oDate;
        this.dueDate = dDate;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer id) {
        this.orderId = id;
    }

    public Timestamp getOrderDate() {
        return orderDate;
    }

    public void setMaterialId(Timestamp oDate) {
        this.orderDate = oDate;
    }

    public Timestamp getMaterialId() {
        return dueDate;
    }

    public void setDueDate(Timestamp dDate) {
        this.dueDate = dDate;
    }
}


