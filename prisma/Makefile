mode ?= dev
ENV_FILE = .env.$(mode)
get_prop = $(shell powershell -NoProfile -Command "$$p = Get-Content $(CONF_FILE) -Raw | ConvertFrom-StringData; $$p['$(1)']")
