param (
    [switch]$override = $false
)

$services = ("user-service", "chat-service", "auth-service", "billing-service", "file-service", "subscription-service", "prometheus", "grafana", "rabbitmq")

$certExamplePath = "./cert-example"

foreach ($service in $services) {
    $servicePath = "../$service"
    $serviceCertPath = $servicePath + "/cert"
    $serviceCertExamplePath = $servicePath + "/cert-example"

    if ($override) {
        if (Test-Path -Path $serviceCertPath) {
            Remove-Item -LiteralPath $serviceCertPath -Force -Recurse
        }
        
        Copy-item -Force -Recurse -Verbose $certExamplePath -Destination $servicePath
        Rename-Item -Path $serviceCertExamplePath -NewName "cert"
    }
    elseif (-Not (Test-Path -Path $serviceCertPath)) {
        Copy-item -Force -Recurse -Verbose $certExamplePath -Destination $servicePath
        Rename-Item -Path $serviceCertExamplePath -NewName "cert"
    }
}