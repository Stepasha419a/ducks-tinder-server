mode ?= dev
CONF_FILE = ./src/main/resources/application-$(mode).properties

CERTS_DIR = ./cert/$(mode)

get_prop = $(shell powershell -NoProfile -Command "$$p = Get-Content $(CONF_FILE) -Raw | ConvertFrom-StringData; $$p['$(1)']")

DB_HOST = $(call get_prop,spring.datasource.host)
DB_PORT = $(call get_prop,spring.datasource.port)
DB_USER = $(call get_prop,spring.datasource.username)
DB_PASS = $(call get_prop,spring.datasource.password)
DB_NAME = $(call get_prop,spring.datasource.database)

DB_URL = postgres://$(DB_USER):$(DB_PASS)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)?sslmode=verify-full&sslrootcert=$(CERTS_DIR)/ca.crt&sslcert=$(CERTS_DIR)/tls.crt&sslkey=$(CERTS_DIR)/tls.key

GRPC_JAVA_PLUGIN = C:/apps/protoc-gen-grpc-java-1.60.0-windows-x86_64/protoc-gen-grpc-java-1.60.0-windows-x86_64.exe

gen-proto:
	protoc \
	  --proto_path=src/main/proto \
	  \
	  --java_out=src/main/java \
	  \
	  --plugin=protoc-gen-grpc-java=$(GRPC_JAVA_PLUGIN) \
	  --grpc-java_out=src/main/java \
	  \
	  src/main/proto/*.proto

# pwsh command - mvn spring-boot:run -D spring-boot.run.profiles=dev
dev:
	mvn spring-boot:run -Dspring-boot.run.profiles=dev

migration:
	atlas migrate hash --dir file://src/main/resources/db/migration
	atlas migrate apply --dir file://src/main/resources/db/migration --url "$(DB_URL)"
