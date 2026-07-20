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

func (s *BillingServiceServerImpl) HandleUserPurchase(ctx context.Context, req *gen.HandleUserPurchaseRequest) (*gen.Purchase, error) {
	dto := interface_common.HandleUserPurchaseDto{UserId: req.UserId, Amount: req.Amount}

	serviceContext := grpc_context_impl.NewServiceContext[*mapper.PurchaseResponse](ctx)
	command, err := dto.ToHandleUserPurchaseCommand(s.validatorService)
	if err != nil {
		msg := err.Error()
		return nil, serviceContext.BadRequest(&msg)
	}

	err = s.billingService.HandleUserPurchase(serviceContext, command)

	if err != nil {
		return nil, err
	}
	if serviceContext.ResponseData == nil || serviceContext.ResponseStatus == 0 {
		return nil, serviceContext.InternalServerError()
	}

	response := &grpc_response.PurchaseResponse{
		PurchaseResponse: serviceContext.ResponseData,
	}

	return response.ToPurchaseGrpcResponse(), nil
}
