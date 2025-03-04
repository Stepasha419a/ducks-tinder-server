#!/bin/bash
set -e

if ! command -v openssl &> /dev/null; then
    echo "OpenSSL not found. Installing..."
    
    apt update && apt install -y openssl && rm -rf /var/lib/apt/lists/*
fi

KEYSTORE_PASSWORD="${KEYSTORE_PASSWORD:-password}"

# resources cert path duplicate same files => verify only one of them
TRUSTSTORE_PATH="/tmp/truststore.jks"
TLS_KEY_DER_PATH="/tmp/tls-key.der"

CERT_PATH="/app/cert/$ACTIVE_PROFILE/ca.crt"
TLS_KEY_PATH="/app/cert/$ACTIVE_PROFILE/tls.key"

if [ -f "$TRUSTSTORE_PATH" ]; then
    echo "Removing existing truststore..."
    rm "$TRUSTSTORE_PATH"
fi
if [ -f "$TLS_KEY_DER_PATH" ]; then
    echo "Removing existing tls-key-der..."
    rm "$TLS_KEY_DER_PATH"
fi

echo "Importing CA certificate to Java truststore..."
keytool -importcert -keystore "$TRUSTSTORE_PATH" -storepass "$KEYSTORE_PASSWORD" -noprompt -alias postgres-ca -file "$CERT_PATH"

echo "Starting application..."
exec java -Djavax.net.ssl.trustStore="$TRUSTSTORE_PATH" -Djavax.net.ssl.trustStorePassword="$KEYSTORE_PASSWORD" -jar /app/target/map_service-0.0.1-SNAPSHOT.jar