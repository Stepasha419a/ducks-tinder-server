package com.tinder.map_service.model;

public class Geocode {
    private String name, address;

    public Geocode(String name, String address) {
        this.name = name;
        this.address = address;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }
}
