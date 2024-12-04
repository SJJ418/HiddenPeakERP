package com.hiddenpeak.erp.entity;

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

    public Integer getInventoryId() {
        return inventoryId;
    }

    public void setInventoruId(Integer id) {
        this.inventoryId = id;
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
