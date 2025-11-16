#!/bin/bash
set -e

export PRISMA_QUERY_ENGINE_LIBRARY="/app/dist/client/libquery_engine-linux-musl-openssl-3.0.x.so.node"

NODE_ENV="${NODE_ENV:-dev-docker}"
IS_MIGRATION="${IS_MIGRATION:-false}"
CLIENT_IDENTITY_PASSWORD="${CLIENT_IDENTITY_PASSWORD:-password}"

CLIENT_IDENTITY_PATH="/tmp/client-identity.p12"

CERT_PATH="/usr/src/app/cert/$NODE_ENV/ca.crt"
TLS_CERT_PATH="/usr/src/app/cert/$NODE_ENV/tls.crt"
TLS_KEY_PATH="/usr/src/app/cert/$NODE_ENV/tls.key"

if [ -f "$CLIENT_IDENTITY_PATH" ]; then
    echo "Removing existing client-identity..."
    rm "$CLIENT_IDENTITY_PATH"
fi

echo "Creating client-identity..."
openssl pkcs12 -export -out $CLIENT_IDENTITY_PATH -inkey $TLS_KEY_PATH -in $TLS_CERT_PATH -certfile $CERT_PATH -name "client-identity" -password pass:$CLIENT_IDENTITY_PASSWORD

if [[ "$IS_MIGRATION" == "true" ]]; then
    echo "Migrating database..."
    npx prisma migrate deploy
else
    echo "Starting application..."
    npm run start:prod
fi
