GRPC_JAVA_PLUGIN = C:/apps/protoc-gen-grpc-java-1.60.0-windows-x86_64/protoc-gen-grpc-java-1.60.0-windows-x86_64.exe

gen-proto:
	protoc \
	  --proto_path=src/main/proto \
	  \
	  --java_out=src/main/java \
	  \
	  --plugin=protoc-gen-grpc-java=$(GRPC_JAVA_PLUGIN) \
	  --grpc-java_out=src/main/java \
	  \
	  src/main/proto/*.proto

# pwsh command - mvn spring-boot:run -D spring-boot.run.profiles=dev
dev:
	mvn spring-boot:run -Dspring-boot.run.profiles=dev

migration:
	mvn clean install