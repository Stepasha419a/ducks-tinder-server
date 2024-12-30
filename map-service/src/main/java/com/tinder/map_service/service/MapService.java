package com.tinder.map_service.service;

import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.tinder.map_service.model.Geocode;
import com.tinder.map_service.repository.LocationRepository;

@Service
public class MapService {

	private final LocationRepository locationRepository;

	public MapService(LocationRepository locationRepository) {
		this.locationRepository = locationRepository;
	}
}
