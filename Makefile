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
