$golangServices = ("auth-service", "billing-service", "file-service", "subscription-service")
$typescriptServices = ("user-service", "chat-service")

$localVarsReplacement = ("postgresql://prisma:prisma@postgres:5432/", "postgresql://prisma:prisma@localhost:5433/"), ("host.docker.internal", "localhost"), ("amqp://rabbitmq:5672", "amqp://localhost:5672")

function SetLocalUrls {
    param (
        $configPath
    )

    $content = Get-Content $configPath
    foreach ($replacement in $localVarsReplacement) {
        $content = $content.Replace($replacement[0], $replacement[1])
    }

    Set-Content $configPath $content
}

foreach ($service in $golangServices) {
    $servicePath = "../$service"

    $configPath = "$servicePath/config"

    $modeConfigPath = "$servicePath"

    $devConfigPath = "$configPath/dev.yaml"
    $devDockerConfigPath = "$configPath/dev-docker.yaml"

    if (Test-Path "$configPath/example.yaml") {
        Write-Host "setting up configs for $service..."

        Copy-Item "$modeConfigPath/.env.example" "$modeConfigPath/.env"

        Copy-Item "$configPath/example.yaml" $devConfigPath
        Copy-Item "$configPath/example.yaml" $devDockerConfigPath

        SetLocalUrls($devConfigPath)
    }
    else {
        Write-Host "no example.yaml file found for $service"
    }
}

