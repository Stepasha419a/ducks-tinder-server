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

func (s *BillingServiceServerImpl) GetUserCreditCard(ctx context.Context, req *gen.GetUserCreditCardRequest) (*gen.CreditCard, error) {
	dto := interface_common.GetUserCreditCardDto{UserId: req.UserId}

	query, err := dto.ToGetUserCreditCardQuery(s.validatorService)
	if err != nil {
		return nil, err
	}

	serviceContext := grpc_context_impl.NewServiceContext[*mapper.CreditCardResponse](ctx)
	err = s.billingService.GetUserCreditCard(serviceContext, query)

	if err != nil {
		return nil, err
	}
	if serviceContext.ResponseData == nil || serviceContext.ResponseStatus == 0 {
		return nil, serviceContext.InternalServerError()
	}

	response := &grpc_response.CreditCardResponse{
		CreditCardResponse: serviceContext.ResponseData,
	}

	return response.ToCreditCardGrpcResponse(), nil
}

func (s *BillingServiceServerImpl) WithdrawUserCreditCard(ctx context.Context, req *gen.WithdrawUserCreditCardRequest) (*gen.Purchase, error) {
	dto := interface_common.WithdrawUserCreditCardDto{UserId: req.UserId, CreditCardId: req.CreditCardId, Amount: req.Amount}

	command, err := dto.ToWithdrawUserCreditCardCommand(s.validatorService)
	if err != nil {
		return nil, err
	}

	serviceContext := grpc_context_impl.NewServiceContext[*mapper.PurchaseResponse](ctx)
	err = s.billingService.WithdrawUserCreditCard(serviceContext, command)

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
