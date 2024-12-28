package com.tinder.map_service.model;

import java.util.Date;
import java.util.UUID;

import org.springframework.lang.Nullable;

public class Location {
  private UUID id;
  private String city, country, adminRegion;
  private LocationCapitalEnum capital = null;
  private double latitude, longitude;
  private Date createdAt;

  public Location(UUID id, String city, String country, String adminRegion,
      @Nullable LocationCapitalEnum capital, double latitude, double longitude, Date createdAt) {
    this.id = id;
    this.city = city;
    this.country = country;
    this.adminRegion = adminRegion;
    this.capital = capital;
    this.latitude = latitude;
    this.longitude = longitude;
    this.createdAt = createdAt;
  }
}
