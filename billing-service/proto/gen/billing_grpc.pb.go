// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.5.1
// - protoc             v5.27.0
// source: proto/billing.proto

package gen

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.64.0 or later.
const _ = grpc.SupportPackageIsVersion9

const (
	BillingService_WithdrawUserCreditCard_FullMethodName = "/billing.BillingService/WithdrawUserCreditCard"
)

// BillingServiceClient is the client API for BillingService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type BillingServiceClient interface {
	WithdrawUserCreditCard(ctx context.Context, in *WithdrawUserCreditCardRequest, opts ...grpc.CallOption) (*Purchase, error)
}

type billingServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewBillingServiceClient(cc grpc.ClientConnInterface) BillingServiceClient {
	return &billingServiceClient{cc}
}

func (c *billingServiceClient) WithdrawUserCreditCard(ctx context.Context, in *WithdrawUserCreditCardRequest, opts ...grpc.CallOption) (*Purchase, error) {
	cOpts := append([]grpc.CallOption{grpc.StaticMethod()}, opts...)
	out := new(Purchase)
	err := c.cc.Invoke(ctx, BillingService_WithdrawUserCreditCard_FullMethodName, in, out, cOpts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// BillingServiceServer is the server API for BillingService service.
// All implementations must embed UnimplementedBillingServiceServer
// for forward compatibility.
type BillingServiceServer interface {
	WithdrawUserCreditCard(context.Context, *WithdrawUserCreditCardRequest) (*Purchase, error)
	mustEmbedUnimplementedBillingServiceServer()
}

// UnimplementedBillingServiceServer must be embedded to have
// forward compatible implementations.
//
// NOTE: this should be embedded by value instead of pointer to avoid a nil
// pointer dereference when methods are called.
type UnimplementedBillingServiceServer struct{}

func (UnimplementedBillingServiceServer) WithdrawUserCreditCard(context.Context, *WithdrawUserCreditCardRequest) (*Purchase, error) {
	return nil, status.Errorf(codes.Unimplemented, "method WithdrawUserCreditCard not implemented")
}
func (UnimplementedBillingServiceServer) mustEmbedUnimplementedBillingServiceServer() {}
func (UnimplementedBillingServiceServer) testEmbeddedByValue()                        {}

// UnsafeBillingServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to BillingServiceServer will
// result in compilation errors.
type UnsafeBillingServiceServer interface {
	mustEmbedUnimplementedBillingServiceServer()
}

func RegisterBillingServiceServer(s grpc.ServiceRegistrar, srv BillingServiceServer) {
	// If the following call pancis, it indicates UnimplementedBillingServiceServer was
	// embedded by pointer and is nil.  This will cause panics if an
	// unimplemented method is ever invoked, so we test this at initialization
	// time to prevent it from happening at runtime later due to I/O.
	if t, ok := srv.(interface{ testEmbeddedByValue() }); ok {
		t.testEmbeddedByValue()
	}
	s.RegisterService(&BillingService_ServiceDesc, srv)
}

func _BillingService_WithdrawUserCreditCard_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(WithdrawUserCreditCardRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(BillingServiceServer).WithdrawUserCreditCard(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: BillingService_WithdrawUserCreditCard_FullMethodName,
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(BillingServiceServer).WithdrawUserCreditCard(ctx, req.(*WithdrawUserCreditCardRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// BillingService_ServiceDesc is the grpc.ServiceDesc for BillingService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var BillingService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "billing.BillingService",
	HandlerType: (*BillingServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "WithdrawUserCreditCard",
			Handler:    _BillingService_WithdrawUserCreditCard_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "proto/billing.proto",
}
