package com.hiddenpeak.erp.dal;

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

    public Material(Integer id, MaterialType mType, Vendor vId, String description, BigDecimal cost, BigDecimal value) {
        this.materialId = id;
        this.materialType = mType;
        this.vendor = vId;
        this.materialDescription = description;
        this.materialCost = cost;
        this.materialValue = value;
    }

    public Integer getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Integer id) {
        this.materialId = id;
    }

    public String getMaterialDescription() {
        return materialDescription;
    }

    public void setMaterialDescriptionName(String description) {
        this.materialDescription = description;
    }

    public BigDecimal getMaterialCost() {
        return materialCost;
    }

    public void setMaterialCost(BigDecimal cost) {
        this.materialCost = cost;
    }

    public BigDecimal getMaterialValue() {
        return materialValue;
    }

    public void setMaterialValue(BigDecimal value) {
        this.materialValue = value;
    }
}
