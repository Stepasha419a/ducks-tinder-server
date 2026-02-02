mode ?= dev
CONF_FILE = ./config/$(mode).yaml

CERTS_DIR = ./cert/$(mode)

DB_HOST = $(shell yq '.postgres_host' $(CONF_FILE))
DB_PORT = $(shell yq '.postgres_port' $(CONF_FILE))
DB_USER = $(shell yq '.postgres_user' $(CONF_FILE))
DB_PASS = $(shell yq '.postgres_password' $(CONF_FILE))
DB_NAME = $(shell yq '.postgres_database' $(CONF_FILE))

DB_URL = postgres://$(DB_USER):$(DB_PASS)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)?sslmode=verify-full&sslrootcert=$(CERTS_DIR)/ca.crt&sslcert=$(CERTS_DIR)/tls.crt&sslkey=$(CERTS_DIR)/tls.key

dev:
	air

migration:
	atlas migrate hash --dir file://migrations
	atlas migrate apply --dir file://migrations --url "$(DB_URL)"
gen-proto:
	protoc --go_out=proto --go-grpc_out=proto proto/billing.proto