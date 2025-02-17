migration:
	go run cmd/migration/migration.go

force-migration:
	go run cmd/migration/migration.go -auto-submit

dev:
	air

gen-proto: gen-billing-proto gen-subscription-proto

gen-billing-proto:
	protoc --go_out=proto --go-grpc_out=proto proto/billing.proto

gen-subscription-proto:
	protoc --go_out=proto --go-grpc_out=proto proto/subscription.proto