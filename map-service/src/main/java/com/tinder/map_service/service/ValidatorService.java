package com.tinder.map_service.service;

public class ValidatorService {
	public static void isValidCoords(double latitude, double longitude) throws Exception {
		if (latitude < -90 || latitude > 90) {
			throw new Exception("Latitude must be value between -90 and 90");
		}

		if (longitude < -180 || longitude > 180) {
			throw new Exception("Longitude must be value between -180 and 180");
		}
	}
}
