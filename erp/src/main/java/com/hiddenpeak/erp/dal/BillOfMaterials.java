package com.hiddenpeak.erp.dal;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "billOfMaterial")
public class BillOfMaterials {
    @Id
    @Column(name = "billOfMaterialId")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer billOfMaterialId;

    @OneToOne
    @JoinColumn(name = "materialId")
    private Material material;

    @OneToMany
    @JoinColumn(name = "materialId")
    private List<Material> componentMaterial;

    private Integer billOfMaterialQty;

    public BillOfMaterials(Integer id, Material mId, List<Material> compId , Integer qty) {
        this.billOfMaterialId = id;
        this.material = mId;
        this.componentMaterial = compId;
        this.billOfMaterialQty = qty;
    }

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
