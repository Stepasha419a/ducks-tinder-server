package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"

	grpc_service "go-file-server/internal/interface/grpc"
	http_service "go-file-server/internal/interface/http"
	config_service "go-file-server/internal/service/config"
	grpc_service "go-file-server/internal/service/grpc"
	tls_service "go-file-server/internal/service/tls"
)

func main() {
	config_service.RequireConfig()

	setUpListeners()
}

func initListeners(g *errgroup.Group, httpService *http_service.HttpService, grpcService *grpc_service.GrpcService) {
	g.Go(func() error {
		return httpService.ListenAndServeTLS()
	})
	g.Go(func() error {
		return grpcService.Serve()
	})
}
}
