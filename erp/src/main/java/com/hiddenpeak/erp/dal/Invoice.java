package com.hiddenpeak.erp.dal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.text.SimpleDateFormat;
import java.util.Date;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "invoice")
public class Invoice {
    @Id
    @Column(name = "invoiceId")
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer invoiceId;

    private String client;

    private Integer amount;

    private String status;

    private String dueDate;

    public Invoice(String customerName, Integer amount, String dueDate) {
        this.client = customerName;
        this.amount = amount;
        this.dueDate = dueDate;

        // initial invoice status is PENDING
        this.status = "PENDING";
    }
}


