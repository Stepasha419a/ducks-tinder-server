$services = @('user-service', 'chat-service', 'file-service', 'auth-service', 'billing-service', 'subscription-service', 'map-service')

docker-compose up --build -d $services

foreach ($service in $services) {
    $sourceImage = "ducks-tinder-$service"
    $targetImage = "localhost:4999/ducks-tinder-$service"
    docker tag $sourceImage $targetImage

    docker push $targetImage
}

helm uninstall postgres prometheus grafana

helm install postgres oci://registry-1.docker.io/bitnamicharts/postgresql -f ./k8s/postgres-values.yaml --version 16.6.5
helm install rabbitmq oci://registry-1.docker.io/bitnamicharts/rabbitmq -f ./k8s/rabbitmq-values.yaml --version 16.0.1
