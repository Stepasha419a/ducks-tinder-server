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

	@Override
	public Optional<Location> findNearestByCoords(double latitude, double longitude) {
		String query =
				"""
						SELECT id, latitude, longitude, city, country, capital, admin_region, created_at,
						6371 * 2 * asin(
							sqrt(
								power(sin(radians((latitude - :latitude) / 2)), 2) +
								cos(radians(:latitude)) * cos(radians(latitude)) * power(sin(radians((longitude - :longitude) / 2)), 2)
							)
						) as distance
						FROM locations
						ORDER BY distance
						LIMIT 1
						""";

		@SuppressWarnings("unchecked")
		Optional<Location> location = entityManager.createNativeQuery(query)
				.setParameter("latitude", latitude).setParameter("longitude", longitude).getResultList()
				.stream().findFirst().map(entity -> LocationConverter.toModelFromRow((Object[]) entity));

		return location;
	}
}
