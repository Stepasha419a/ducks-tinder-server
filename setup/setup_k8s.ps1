$services = @('user-service', 'chat-service', 'file-service', 'auth-service', 'billing-service', 'subscription-service', 'map-service')

docker-compose up --build -d $services
