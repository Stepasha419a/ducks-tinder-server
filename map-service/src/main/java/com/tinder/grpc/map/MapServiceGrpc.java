package com.tinder.grpc.map;

import static io.grpc.MethodDescriptor.generateFullMethodName;

/**
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.60.0)",
    comments = "Source: map_service.proto")
@io.grpc.stub.annotations.GrpcGenerated
public final class MapServiceGrpc {

  private MapServiceGrpc() {}

  public static final java.lang.String SERVICE_NAME = "map.MapService";

  // Static method descriptors that strictly reflect the proto.
  private static volatile io.grpc.MethodDescriptor<com.tinder.grpc.map.GetGeocodeRequest,
      com.tinder.grpc.map.Geocode> getGetGeocodeMethod;

  @io.grpc.stub.annotations.RpcMethod(
      fullMethodName = SERVICE_NAME + '/' + "GetGeocode",
      requestType = com.tinder.grpc.map.GetGeocodeRequest.class,
      responseType = com.tinder.grpc.map.Geocode.class,
      methodType = io.grpc.MethodDescriptor.MethodType.UNARY)
  public static io.grpc.MethodDescriptor<com.tinder.grpc.map.GetGeocodeRequest,
      com.tinder.grpc.map.Geocode> getGetGeocodeMethod() {
    io.grpc.MethodDescriptor<com.tinder.grpc.map.GetGeocodeRequest, com.tinder.grpc.map.Geocode> getGetGeocodeMethod;
    if ((getGetGeocodeMethod = MapServiceGrpc.getGetGeocodeMethod) == null) {
      synchronized (MapServiceGrpc.class) {
        if ((getGetGeocodeMethod = MapServiceGrpc.getGetGeocodeMethod) == null) {
          MapServiceGrpc.getGetGeocodeMethod = getGetGeocodeMethod =
              io.grpc.MethodDescriptor.<com.tinder.grpc.map.GetGeocodeRequest, com.tinder.grpc.map.Geocode>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(SERVICE_NAME, "GetGeocode"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.tinder.grpc.map.GetGeocodeRequest.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.tinder.grpc.map.Geocode.getDefaultInstance()))
              .setSchemaDescriptor(new MapServiceMethodDescriptorSupplier("GetGeocode"))
              .build();
        }
      }
    }
    return getGetGeocodeMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static MapServiceStub newStub(io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MapServiceStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MapServiceStub>() {
        @java.lang.Override
        public MapServiceStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MapServiceStub(channel, callOptions);
        }
      };
    return MapServiceStub.newStub(factory, channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static MapServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MapServiceBlockingStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MapServiceBlockingStub>() {
        @java.lang.Override
        public MapServiceBlockingStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MapServiceBlockingStub(channel, callOptions);
        }
      };
    return MapServiceBlockingStub.newStub(factory, channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static MapServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    io.grpc.stub.AbstractStub.StubFactory<MapServiceFutureStub> factory =
      new io.grpc.stub.AbstractStub.StubFactory<MapServiceFutureStub>() {
        @java.lang.Override
        public MapServiceFutureStub newStub(io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
          return new MapServiceFutureStub(channel, callOptions);
        }
      };
    return MapServiceFutureStub.newStub(factory, channel);
  }

  /**
   */
  public interface AsyncService {

    /**
     */
    default void getGeocode(com.tinder.grpc.map.GetGeocodeRequest request,
        io.grpc.stub.StreamObserver<com.tinder.grpc.map.Geocode> responseObserver) {
      io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall(getGetGeocodeMethod(), responseObserver);
    }
  }

  /**
   * Base class for the server implementation of the service MapService.
   */
  public static abstract class MapServiceImplBase
      implements io.grpc.BindableService, AsyncService {

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return MapServiceGrpc.bindService(this);
    }
  }

  /**
   * A stub to allow clients to do asynchronous rpc calls to service MapService.
   */
  public static final class MapServiceStub
      extends io.grpc.stub.AbstractAsyncStub<MapServiceStub> {
    private MapServiceStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MapServiceStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MapServiceStub(channel, callOptions);
    }

    /**
     */
    public void getGeocode(com.tinder.grpc.map.GetGeocodeRequest request,
        io.grpc.stub.StreamObserver<com.tinder.grpc.map.Geocode> responseObserver) {
      io.grpc.stub.ClientCalls.asyncUnaryCall(
          getChannel().newCall(getGetGeocodeMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   * A stub to allow clients to do synchronous rpc calls to service MapService.
   */
  public static final class MapServiceBlockingStub
      extends io.grpc.stub.AbstractBlockingStub<MapServiceBlockingStub> {
    private MapServiceBlockingStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MapServiceBlockingStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MapServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public com.tinder.grpc.map.Geocode getGeocode(com.tinder.grpc.map.GetGeocodeRequest request) {
      return io.grpc.stub.ClientCalls.blockingUnaryCall(
          getChannel(), getGetGeocodeMethod(), getCallOptions(), request);
    }
  }

  /**
   * A stub to allow clients to do ListenableFuture-style rpc calls to service MapService.
   */
  public static final class MapServiceFutureStub
      extends io.grpc.stub.AbstractFutureStub<MapServiceFutureStub> {
    private MapServiceFutureStub(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MapServiceFutureStub build(
        io.grpc.Channel channel, io.grpc.CallOptions callOptions) {
      return new MapServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.tinder.grpc.map.Geocode> getGeocode(
        com.tinder.grpc.map.GetGeocodeRequest request) {
      return io.grpc.stub.ClientCalls.futureUnaryCall(
          getChannel().newCall(getGetGeocodeMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_GET_GEOCODE = 0;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final AsyncService serviceImpl;
    private final int methodId;

    MethodHandlers(AsyncService serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_GET_GEOCODE:
          serviceImpl.getGeocode((com.tinder.grpc.map.GetGeocodeRequest) request,
              (io.grpc.stub.StreamObserver<com.tinder.grpc.map.Geocode>) responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  public static final io.grpc.ServerServiceDefinition bindService(AsyncService service) {
    return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
        .addMethod(
          getGetGeocodeMethod(),
          io.grpc.stub.ServerCalls.asyncUnaryCall(
            new MethodHandlers<
              com.tinder.grpc.map.GetGeocodeRequest,
              com.tinder.grpc.map.Geocode>(
                service, METHODID_GET_GEOCODE)))
        .build();
  }

  private static abstract class MapServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    MapServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.tinder.grpc.map.MapServiceOuterClass.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("MapService");
    }
  }

  private static final class MapServiceFileDescriptorSupplier
      extends MapServiceBaseDescriptorSupplier {
    MapServiceFileDescriptorSupplier() {}
  }

  private static final class MapServiceMethodDescriptorSupplier
      extends MapServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final java.lang.String methodName;

    MapServiceMethodDescriptorSupplier(java.lang.String methodName) {
      this.methodName = methodName;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.MethodDescriptor getMethodDescriptor() {
      return getServiceDescriptor().findMethodByName(methodName);
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (MapServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new MapServiceFileDescriptorSupplier())
              .addMethod(getGetGeocodeMethod())
              .build();
        }
      }
    }
    return result;
  }
}
