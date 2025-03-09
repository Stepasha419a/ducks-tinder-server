#!/bin/bash
set -e

NODE_ENV="${NODE_ENV:-dev-docker}"
IS_MIGRATION="${IS_MIGRATION:-false}"
MIGRATION_DB_NAME="${MIGRATION_DB_NAME}"
CLIENT_IDENTITY_PASSWORD="${CLIENT_IDENTITY_PASSWORD:-password}"

CLIENT_IDENTITY_PATH="/tmp/client-identity.p12"

CERT_PATH="/usr/src/app/cert/$NODE_ENV/ca.crt"
TLS_CERT_PATH="/usr/src/app/cert/$NODE_ENV/tls.crt"
TLS_KEY_PATH="/usr/src/app/cert/$NODE_ENV/tls.key"
