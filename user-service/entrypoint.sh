#!/bin/bash
set -e

NODE_ENV="${NODE_ENV:-dev-docker}"
CLIENT_IDENTITY_PASSWORD="${CLIENT_IDENTITY_PASSWORD:-password}"

CLIENT_IDENTITY_PATH="/tmp/client-identity.p12"

CERT_PATH="/usr/src/app/cert/$NODE_ENV/ca.crt"
TLS_CERT_PATH="/usr/src/app/cert/$NODE_ENV/tls.crt"
TLS_KEY_PATH="/usr/src/app/cert/$NODE_ENV/tls.key"

echo "Creating client-identity..."
openssl pkcs12 -export -out $CLIENT_IDENTITY_PATH -inkey $TLS_KEY_PATH -in $TLS_CERT_PATH -certfile $CERT_PATH -name "client-identity" -password pass:$CLIENT_IDENTITY_PASSWORD

echo "Starting application..."
npm run start:prod
