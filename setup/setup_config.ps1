$golangServices = ("auth-service", "billing-service", "file-service", "subscription-service")
$typescriptServices = ("user-service", "chat-service")

$yamlConfigServices = ("database-seeder")
$onlyDevConfigServices = ("database-seeder")

$localVarsReplacement = ("postgresql://prisma:prisma@postgres:5432/", "postgresql://prisma:prisma@127.0.0.1:5433/"), ("host.docker.internal", "127.0.0.1"), ("amqp://rabbitmq:5672", "amqp://127.0.0.1:5672")

$secretsReplacementEnvFilePath = "../.env.secrets"

function GetSecretsReplacementEnvVariables {
    $envVariables = @{}

    if (-Not(Test-Path $secretsReplacementEnvFilePath)) {
        return $envVariables
    }

    foreach ($line in Get-Content -Path $secretsReplacementEnvFilePath) {
        if ($line -match "^\s*#") { continue }
        if ($line -match "^\s*$") { continue }

        $key, $value = $line -split "=", 2
        $envVariables[$key.Trim()] = $value.Trim()
    }

    return $envVariables
}

$envVariables = GetSecretsReplacementEnvVariables

function SetSecretsRelacement {
    param (
        $configPath
    )

    if (-Not(Test-Path $secretsReplacementEnvFilePath)) {
        return
    }

    $content = Get-Content -Path $configPath
    foreach ($key in $envVariables.Keys) {
        $value = $envVariables[$key]

        $content = $content.Replace($key, $value)
    }

    Set-Content $configPath $content
}

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



function SetUpYamlConfigService {
    param (
        $servicePath
    )

    $configPath = "$servicePath/config"

    $modeConfigPath = "$servicePath"

    $devConfigPath = "$configPath/dev.yaml"
    $devDockerConfigPath = "$configPath/dev-docker.yaml"

    if (Test-Path "$configPath/example.yaml") {
        Write-Host "setting up configs for $service..."

        Copy-Item "$modeConfigPath/.env.example" "$modeConfigPath/.env"

        if (-Not($onlyDevConfigServices.Contains($service))) {
            Copy-Item "$configPath/example.yaml" $devDockerConfigPath
            
            SetSecretsRelacement($devDockerConfigPath)
        }

        Copy-Item "$configPath/example.yaml" $devConfigPath

        SetSecretsRelacement($devConfigPath)
        SetLocalUrls($devConfigPath)
    }
    else {
        Write-Host "no example.yaml file found for $service"
    }
}

foreach ($service in $golangServices) {
    $servicePath = "../$service"

    SetUpYamlConfigService($servicePath)
}

foreach ($service in $yamlConfigServices) {
    $servicePath = "../$service"

    SetUpYamlConfigService($servicePath)
}

foreach ($service in $typescriptServices) {
    $servicePath = "../$service"

    $devConfigPath = "$servicePath/.env.dev"
    $devDockerConfigPath = "$servicePath/.env.dev-docker"

    if (Test-Path "$servicePath/.env.example") {
        Write-Host "setting up configs for $service..."

        Copy-Item "$servicePath/.env.example" "$servicePath/.env.dev"
        Copy-Item "$servicePath/.env.example" "$servicePath/.env.dev-docker"

        SetSecretsRelacement($devConfigPath)
        SetSecretsRelacement($devDockerConfigPath)
        SetLocalUrls("$servicePath/.env.dev")
    }
    else {
        Write-Host "no example.yaml file found for $service"
    }
}

Write-Host "setting up configs for docker..."
        
$dockerEnvExamplePath = "../.env.example"

Copy-Item $dockerEnvExamplePath "../.env"
