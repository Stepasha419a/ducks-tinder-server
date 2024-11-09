$services = ("user-service", "chat-service", "auth-service", "billing-service", "file-service", "subscription-service", "prometheus")

$certExamplePath = "./cert-example"

foreach ($service in $services) {
    $servicePath = "../$service"
    $serviceCertPath = $servicePath + "/cert"
    $serviceCertExamplePath = $servicePath + "/cert-example"

    if (-Not (Test-Path -Path $serviceCertPath)) {
        Copy-item -Force -Recurse -Verbose $certExamplePath -Destination $servicePath
        Rename-Item -Path $serviceCertExamplePath -NewName "cert"
    }
}