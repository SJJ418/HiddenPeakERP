package com.hiddenpeak.erp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "billOfMaterial")
public class BillOfMaterials {
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    @Column(name = "billOfmMaterialId")
    private Integer billOfMaterialId;

    @OneToOne
    @JoinColumn(name = "materialId")
    private Material material;

    @OneToMany
    @JoinColumn(name = "materialId")
    private Material componentMaterial;

    private Integer billOfMaterialQty;

    public Integer getBillOfMaterialId() {
        return billOfMaterialId;
    }

    public void setBillOfMaterialId(Integer id) {
        this.billOfMaterialId = id;
    }

    public Integer getBillOfMaterialQty() {
        return billOfMaterialQty;
    }

    public void setBillOfMaterialQty(Integer qty) {
        this.billOfMaterialQty = qty;
    }
}
