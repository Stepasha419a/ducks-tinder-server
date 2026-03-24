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

helm install prometheus prometheus-community/prometheus -f ./k8s/prometheus-values.yaml --version 27.11.0
helm install grafana grafana/grafana -f ./k8s/grafana-values.yaml --version 8.14.2

$deploymentsString = ($services | ForEach-Object { "$_`-deployment" }) -join ' '
kubectl delete deployment $deploymentsString
