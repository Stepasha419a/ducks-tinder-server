if (-not (Get-Command "openssl" -ErrorAction SilentlyContinue)) {
    Write-Host "openssl not found" -ForegroundColor Red
    exit 1
}

$commands = @(
    'openssl req -x509 -new -nodes -keyout cert/ca.key -out cert/ca.crt -days 365 -subj "/C=GB/ST=State/L=City/O=Organization/CN=MyCA"',
    "openssl req -new -nodes -newkey rsa:2048 -keyout cert/tls.key -out cert/server.csr -config config.cfg",
    "openssl x509 -req -in cert/server.csr -CA cert/ca.crt -CAkey cert/ca.key -CAcreateserial -out cert/tls.crt -days 365 -extensions v3_req -extfile config.cfg",
    "openssl pkcs12 -export -out cert/client-identity.p12 -inkey cert/tls.key -in cert/tls.crt",
    "openssl rsa -in cert/tls.key -inform PEM -out cert/tls-key.pk8 -outform DER",
    "openssl x509 -in cert/tls.crt -out cert/tls-crt.der -outform DER",
    "openssl x509 -in cert/ca.crt -out cert/ca-crt.der -outform DER"
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