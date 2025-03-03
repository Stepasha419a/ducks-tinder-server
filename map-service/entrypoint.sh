#!/bin/bash
set -e

ACTIVE_PROFILE="${SPRING_PROFILES_ACTIVE:-dev-docker}"
KEYSTORE_PASSWORD="${KEYSTORE_PASSWORD:-password}"

# resources cert path duplicate same files => verify only one of them
TRUSTSTORE_PATH="/app/cert/$ACTIVE_PROFILE/truststore.jks"
CERT_PATH="/app/cert/$ACTIVE_PROFILE/ca.crt"

echo "Importing CA certificate to Java truststore..."
keytool -importcert -keystore "$TRUSTSTORE_PATH" -storepass "$KEYSTORE_PASSWORD" -noprompt -alias postgres-ca -file "$CERT_PATH"

echo "Starting application..."
exec java -Djavax.net.ssl.trustStore="$TRUSTSTORE_PATH" -Djavax.net.ssl.trustStorePassword="$KEYSTORE_PASSWORD" -jar /app/target/map_service-0.0.1-SNAPSHOT.jar