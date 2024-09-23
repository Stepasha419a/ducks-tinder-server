package grpc_billing_server_impl

import (
	"billing-service/proto/gen"
	"context"
)

type BillingServiceServerImpl struct {
	gen.UnimplementedBillingServiceServer
}

func NewBillingServiceServerImpl() *BillingServiceServerImpl {
	return &BillingServiceServerImpl{}
}

func (f *BillingServiceServerImpl) WithdrawUserCreditCardRequest(context context.Context, req *gen.WithdrawUserCreditCardRequest) (*gen.Purchase, error) {
	return nil, nil
}
