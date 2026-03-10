$services = @('user-service', 'chat-service', 'file-service', 'auth-service', 'billing-service', 'subscription-service', 'map-service')

docker-compose up --build -d $services

foreach ($service in $services) {
    $sourceImage = "ducks-tinder-$service"
    $targetImage = "localhost:4999/ducks-tinder-$service"
    docker tag $sourceImage $targetImage

    docker push $targetImage
}
