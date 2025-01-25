.PHONY: dev user-service chat-service file-service auth-service

dev:
	@$(MAKE) -j user-service chat-service file-service

user-service:
	-npm run start:dev --prefix user-service &

chat-service:
	-npm run start:dev --prefix chat-service &

file-service:
	cd file-service && air

auth-service:
	cd auth-service && air

setup-certs: 
	powershell -File setup/setup_certificates.ps1 -override

setup-configs:
	powershell -File setup/setup_config.ps1

set-up-database: | migrate-prisma force-migration-auth-service force-migration-billing-service force-migration-subscription-service migrate-map-service seed-databases

migrate-prisma:
	cd prisma && npm run migrate:postgres

force-migration-auth-service:
	cd auth-service && make force-migration

force-migration-billing-service:
	cd billing-service && make force-migration

force-migration-subscription-service:
	cd subscription-service && make force-migration

migrate-map-service:
	cd map-service && make migration

seed-databases:
	cd database-seeder && make seed