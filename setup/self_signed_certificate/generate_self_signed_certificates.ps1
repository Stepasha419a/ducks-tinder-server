if (-not (Get-Command "openssl" -ErrorAction SilentlyContinue)) {
    Write-Host "openssl not found" -ForegroundColor Red
    exit 1
}
if (-not (Get-Command "keytool" -ErrorAction SilentlyContinue)) {
    Write-Host "keytool not found" -ForegroundColor Red
    exit 1
}

Get-ChildItem -Path ./cert -Include *.* -File -Recurse | foreach { $_.Delete()}

$commands = @(
    'openssl req -x509 -new -nodes -keyout cert/ca.key -out cert/ca.crt -days 365 -subj "/C=GB/ST=State/L=City/O=Organization/CN=MyCA"',
    "openssl req -new -nodes -newkey rsa:2048 -keyout cert/tls.key -out cert/server.csr -config config.cfg",
    "openssl x509 -req -in cert/server.csr -CA cert/ca.crt -CAkey cert/ca.key -CAcreateserial -out cert/tls.crt -days 365 -extensions v3_req -extfile config.cfg",
    "openssl pkcs12 -export -out cert/client-identity.p12 -inkey cert/tls.key -in cert/tls.crt -certfile cert/ca.crt -name `"postgresql-client`" -password pass:password",
    "openssl pkcs8 -topk8 -inform PEM -outform DER -in cert/tls.key -out cert/tls-key.der -nocrypt",
    "keytool -importkeystore -srckeystore cert/client-identity.p12 -srcstoretype PKCS12 -srcstorepass password -destkeystore cert/client-identity.jks -deststoretype JKS -deststorepass password",
    "keytool -import -trustcacerts -file cert/ca.crt -keystore cert/truststore.jks -storepass password -noprompt"
)

New-Item -ItemType Directory -Force -Path ./cert

foreach ($command in $commands) {
    Write-Host "execute: $command" -ForegroundColor Yellow
    try {
        Invoke-Expression $command
    }
    catch {
        Write-Host "error: $command" -ForegroundColor Red
        exit 1
    }
}