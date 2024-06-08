package grpc_service

import (
	"fmt"
	"go-file-server/proto/gen"
	"log"
	"net"
	"os"
	"strconv"

	"google.golang.org/grpc"
)

func Init() {
	server := grpc.NewServer(grpc.UnaryInterceptor(RecoveryUnaryInterceptor))

	fileServer := FileServiceServerImpl{}

	gen.RegisterFileServiceServer(server, &fileServer)

	PORT := os.Getenv("GRPC_PORT")

	con, err := net.Listen("tcp", fmt.Sprintf(":%s", PORT))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	defer func() {
		server.Stop()
		con.Close()
	}()

	INT_PORT, _ := strconv.Atoi(PORT)
	log.Printf("gRPC server listening on port %d", INT_PORT)
	if err := server.Serve(con); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
