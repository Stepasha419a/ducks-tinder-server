package grpc_billing_service_server_impl

import (
	"billing-service/internal/application/mapper"
	"billing-service/internal/application/service"
	validator_service "billing-service/internal/domain/service/validator"
	interface_common "billing-service/internal/interface/common"
	grpc_context_impl "billing-service/internal/interface/grpc/context"
	grpc_response "billing-service/internal/interface/grpc/response"
	"billing-service/proto/gen"
	"context"
)

type BillingServiceServerImpl struct {
	gen.UnimplementedBillingServiceServer
	billingService   service.BillingService
	validatorService validator_service.ValidatorService
}

func NewBillingServiceServerImpl(billingService service.BillingService, validatorService validator_service.ValidatorService) *BillingServiceServerImpl {
	return &BillingServiceServerImpl{billingService: billingService, validatorService: validatorService}
}

func (f *BillingServiceServerImpl) WithdrawUserCreditCardRequest(context context.Context, req *gen.WithdrawUserCreditCardRequest) (*gen.Purchase, error) {
	return nil, nil
}
