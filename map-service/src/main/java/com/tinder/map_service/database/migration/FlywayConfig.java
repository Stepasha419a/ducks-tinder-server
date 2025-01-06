package com.tinder.map_service.database.migration;

import java.sql.DriverManager;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class FlywayConfig {

	@Value("${spring.datasource.url}")
	private String databaseUrl;

	@Value("${spring.datasource.username}")
	private String username;

	@Value("${spring.datasource.password}")
	private String password;
	private void createDatabase() {
		var serviceDb = databaseUrl.split("/")[databaseUrl.split("/").length - 1];
		var baseDbUrl = databaseUrl.replace(serviceDb, "postgres");

		try (var connection = DriverManager.getConnection(baseDbUrl, username, password);
				var statement = connection.createStatement()) {

			statement.executeUpdate("CREATE DATABASE \"" + serviceDb + "\";");
			log.info("Database created successfully");
		} catch (Exception e) {
			log.info("Database already exists or cannot be created: " + e.getMessage());
		}
	}
}
