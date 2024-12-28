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
}
