package com.hiddenpeak.erp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "materialType")
public class MaterialType {
    @Id
    @Column(name = "materialTypeId")
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer materialTypeId;

    private String materialTypeDescription;

    public Integer getId() {
        return id;
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
