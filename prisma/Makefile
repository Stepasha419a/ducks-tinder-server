mode ?= dev
ENV_FILE = .env.$(mode)
get_prop = $(shell powershell -NoProfile -Command "$$p = Get-Content $(CONF_FILE) -Raw | ConvertFrom-StringData; $$p['$(1)']")

GET_DB_URL = $(shell powershell -NoProfile -Command "\
	if (Test-Path $(ENV_FILE)) { \
		$$p = Get-Content $(ENV_FILE) -Raw | ConvertFrom-StringData; \
		$$p['DATABASE_URL'] \
	} else { \
		Write-Error 'File $(ENV_FILE) not found' \
	}")

DB_URL := $(GET_DB_URL)

MIGRATIONS_DIR = ./migrations
PRISMA_SCHEMA = ./schema.prisma

.PHONY: migrate-gen migrate-apply
