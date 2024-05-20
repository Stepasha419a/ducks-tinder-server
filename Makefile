.PHONY: dev user-service chat-service

dev:
	@$(MAKE) -j user-service chat-service

user-service:
	-npm run start:dev --prefix user-service &

chat-service:
	-npm run start:dev --prefix chat-service &