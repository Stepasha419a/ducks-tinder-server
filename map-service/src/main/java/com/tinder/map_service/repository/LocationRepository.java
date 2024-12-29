package com.tinder.map_service.repository;

import java.util.Optional;

import com.tinder.map_service.model.Location;

public interface LocationRepository {
    Optional<Location> findNearestByCoords(double latitude, double longitude);
}
