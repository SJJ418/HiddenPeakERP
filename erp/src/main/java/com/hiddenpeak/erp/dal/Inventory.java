package com.hiddenpeak.erp.dal;

import jakarta.persistence.*;

@Entity
@Table(name = "inventory")
public class Inventory {
    @Id
    @Column(name = "inventoryId")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer inventoryId;

    @OneToOne
    @JoinColumn(name = "materialId")
    private Material material;

    private Integer inventoryQty;

    public Inventory(Integer id, Material mId, Integer Qty) {
        this.inventoryId = id;
        this.material = mId;
        this.inventoryQty = Qty;
    }

    public Integer getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Integer id) {
        this.inventoryId = id;
    }

    public Integer getInventoryQty() {
        return inventoryQty;
    }

    public void setInventoryQty(Integer Qty) {
        this.inventoryQty = Qty;
    }
}
