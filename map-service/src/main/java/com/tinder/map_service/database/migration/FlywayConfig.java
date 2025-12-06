package com.tinder.map_service.database.migration;

import java.sql.DriverManager;
import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import lombok.extern.slf4j.Slf4j;

@Profile("!test")
@Slf4j
@Configuration
public class FlywayConfig {

	@Value("${spring.datasource.url}")
	private String databaseUrl;

	@Value("${app.datasource.database-name}")
	private String databaseName;

	@Value("${spring.datasource.username}")
	private String username;

	@Value("${spring.datasource.password}")
	private String password;

	@Bean
	public Flyway flyway() {

		createDatabase();

		var flyway = Flyway.configure().dataSource(databaseUrl, username, password).load();
		flyway.migrate();
		return flyway;
	}
}
