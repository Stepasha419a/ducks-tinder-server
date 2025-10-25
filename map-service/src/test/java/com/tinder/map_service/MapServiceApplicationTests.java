package com.tinder.map_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import com.tinder.map_service.database.repository_impl.LocationRepositoryImpl;

@SpringBootTest(properties = "spring.profiles.active=test")
class MapServiceApplicationTests {

	@MockBean
	private LocationRepositoryImpl locationRepository;

	@Test
	void contextLoads() {}
}
