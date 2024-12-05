package com.hiddenpeak.erp.entity;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "materialType")
public class MaterialType {
    @Id
    @Column(name = "materialTypeId")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer materialTypeId;

    private String materialTypeDescription;

    public MaterialType(Integer id, String description) {
        this.materialTypeId = id;
        this.materialTypeDescription = description;
    }

    public Integer getMaterialTypeId() {
        return materialTypeId;
    }

    public void setMaterialTypeId(Integer id) {
        this.materialTypeId = id;
    }

    public String getMaterialTypeDescription() {
        return materialTypeDescription;
    }

    public void setMaterialTypeDescription(String description) {
        this.materialTypeDescription = description;
    }
}
