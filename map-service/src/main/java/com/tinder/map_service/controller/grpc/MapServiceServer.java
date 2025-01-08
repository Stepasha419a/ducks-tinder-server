package com.tinder.map_service.controller.grpc;

import com.tinder.grpc.map.Geocode;
import com.tinder.grpc.map.GetGeocodeRequest;
import com.tinder.grpc.map.MapServiceGrpc.MapServiceImplBase;
import com.tinder.map_service.error.GrpcError;
import com.tinder.map_service.service.MapService;
import com.tinder.map_service.service.ValidatorService;

import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class MapServiceServer extends MapServiceImplBase {
	private final MapService mapService;

	public MapServiceServer(MapService mapService) {
		this.mapService = mapService;
	}
}