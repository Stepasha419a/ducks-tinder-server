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

migrate-gen:
	@powershell -Command "\
	$$name = Read-Host 'Enter migration name'; \
	$$env:DATABASE_URL = '$(DB_URL)'; \
	$$timestamp = Get-Date -Format 'yyyyMMddHHmmss'; \
	$$path = '$(MIGRATIONS_DIR)/' + $$timestamp + '_' + $$name + '.sql'; \
	$$scriptArray = npx prisma migrate diff --from-schema-datasource $(PRISMA_SCHEMA) --to-schema-datamodel $(PRISMA_SCHEMA) --script; \
	$$scriptString = $$scriptArray -join \"`n\"; \
	$$utf8NoBom = New-Object System.Text.UTF8Encoding($$false); \
	atlas migrate hash --dir "file://$(MIGRATIONS_DIR)"
