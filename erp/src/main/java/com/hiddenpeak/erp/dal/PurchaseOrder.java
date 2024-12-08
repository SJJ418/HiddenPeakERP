package com.hiddenpeak.erp.dal;

import jakarta.persistence.*;

import java.text.SimpleDateFormat;
import java.util.Date;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "purchaseOrder")
public class PurchaseOrder {
    @Id
    @Column(name = "orderId")
    private Integer orderId;

    private String customerName;

    private Integer quantity;

    private String orderDate;

    private String dueDate;

    private String status;

    private Integer cost;

    String zip;

    public PurchaseOrder(Integer id, String customerName, Integer quantity, String completionDate, Integer cost, String zip) {
        this.orderId = id;
        this.customerName = customerName;
        this.quantity = quantity;
        this.dueDate = completionDate;
        this.cost = cost;
        this.zip = zip;

        // order date is today
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        this.orderDate = formatter.format(date);

        // initial order status is PENDING
        this.status = "PENDING";
    }
}


