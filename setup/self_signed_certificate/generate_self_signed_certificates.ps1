if (-not (Get-Command "openssl" -ErrorAction SilentlyContinue)) {
    Write-Host "openssl not found" -ForegroundColor Red
    exit 1
}

$commands = @(
    'openssl req -x509 -new -nodes -keyout cert/ca.key -out cert/ca.crt -days 365 -subj "/C=GB/ST=State/L=City/O=Organization/CN=MyCA"',
    "openssl req -new -nodes -newkey rsa:2048 -keyout cert/private-key.pem -out cert/server.csr -config config.cfg",
    "openssl x509 -req -in cert/server.csr -CA cert/ca.crt -CAkey cert/ca.key -CAcreateserial -out cert/certificate.pem -days 365 -extensions v3_req -extfile config.cfg"
)

New-Item -ItemType Directory -Force -Path ./cert

foreach ($command in $commands) {
    Write-Host "execute: $command" -ForegroundColor Yellow
    try {
        Invoke-Expression $command
    } catch {
        Write-Host "error: $command" -ForegroundColor Red
        exit 1
    }
}