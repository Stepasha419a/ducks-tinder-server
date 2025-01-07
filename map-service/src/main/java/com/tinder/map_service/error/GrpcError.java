package com.tinder.map_service.error;

import io.grpc.Metadata;
import io.grpc.protobuf.ProtoUtils;
import io.grpc.reflection.v1alpha.ErrorResponse;
import io.grpc.stub.StreamObserver;

public class GrpcError {
	private static Metadata.Key<ErrorResponse> errorResponseKey =
			ProtoUtils.keyForProto(ErrorResponse.getDefaultInstance());

	public static <T> void ValidationFailed(StreamObserver<T> responseObserver,
			Exception validationException) {
		var metadata = getErrorMetadata();

		responseObserver.onError(io.grpc.Status.INVALID_ARGUMENT
				.withDescription("Validation Failed: " + validationException.getMessage())
				.asRuntimeException(metadata));
	}

	private static Metadata getErrorMetadata() {
		ErrorResponse errorResponse = ErrorResponse.newBuilder().build();

		Metadata metadata = new Metadata();
		metadata.put(errorResponseKey, errorResponse);

		return metadata;
	}
}
