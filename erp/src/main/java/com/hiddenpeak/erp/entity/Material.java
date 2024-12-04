package com.hiddenpeak.erp.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "material")
public class Material {
    @Id
    @Column(name = "materialId")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer materialId;

    @OneToOne
    @JoinColumn(name = "materialTypeId")
    private MaterialType materialType;

    @OneToOne
    @JoinColumn(name = "vendorId")
    private Vendor vendor;

    private String materialDescription;

    private BigDecimal materialCost;

    private BigDecimal materialValue;


    public static Integer getId() {
        return materialId;
    }

    public void setId(Integer id) {
        this.id = id;
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
