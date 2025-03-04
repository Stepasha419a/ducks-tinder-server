param (
    [switch]$override = $false,
    [string]$rootPath = './',
    [string]$certExamplePath = 'setup/cert-example'
)

$services = ("user-service", "chat-service", "auth-service", "billing-service", "file-service", "subscription-service", "prometheus", "grafana", "rabbitmq", "map-service", "database")

foreach ($service in $service")


function SetUpCert {
    param (
        $certRootPath
    )
    
    $serviceCertPath = $certRootPath + "/cert"
    $serviceCertExamplePath = $certRootPath + "/cert-example"

    if ($override) {
        if (Test-Path -Path $serviceCertPath) {
            Remove-Item -LiteralPath $serviceCertPath -Force -Recurse
        }
        
        Copy-item -Force -Recurse -Verbose $certExamplePath -Destination $certRootPath
        Rename-Item -Path $serviceCertExamplePath -NewName "cert"
    }
    elseif (-Not (Test-Path -Path $serviceCertPath)) {
        Copy-item -Force -Recurse -Verbose $certExamplePath -Destination $certRootPath
        Rename-Item -Path $serviceCertExamplePath -NewName "cert"
    }
}

foreach ($service in $services) {
    $servicePath = $rootPath + $service

    SetUpCert($servicePath)
}
