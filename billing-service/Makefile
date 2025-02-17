migration:
	go run cmd/migration/migration.go
	
force-migration:
	go run cmd/migration/migration.go -auto-submit

dev:
	air

gen-proto:
	protoc --go_out=proto --go-grpc_out=proto proto/billing.proto