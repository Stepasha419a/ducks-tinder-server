package com.tinder.map_service.database.repository_impl;

import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.tinder.map_service.database.converter.LocationConverter;
import com.tinder.map_service.model.Location;
import com.tinder.map_service.repository.LocationRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class LocationRepositoryImpl implements LocationRepository {

	@PersistenceContext
	private EntityManager entityManager;
}
