package grpc_response

import (
	"billing-service/internal/application/mapper"
	"billing-service/proto/gen"

	"google.golang.org/protobuf/types/known/timestamppb"
)

type PurchaseResponse struct {
	*mapper.PurchaseResponse
}

func (r *PurchaseResponse) ToPurchaseGrpcResponse() *gen.Purchase {
	createdAt := timestamppb.New(r.CreatedAt)

	return &gen.Purchase{
		Id:           r.Id,
		CreditCardId: r.CreditCardId,
		Amount:       uint32(r.Amount),
		CreatedAt:    createdAt,
	}
}

type CreditCardResponse struct {
	*mapper.CreditCardResponse
}

func (r *CreditCardResponse) ToCreditCardGrpcResponse() *gen.CreditCard {
	expiresAt := timestamppb.New(r.ExpiresAt)
	createdAt := timestamppb.New(r.CreatedAt)
	updatedAt := timestamppb.New(r.UpdatedAt)

	return &gen.CreditCard{
		Id:     r.Id,
		UserId: r.UserId,
		Pan:    r.Pan,
		Holder: r.Holder,
		Cvc:    r.Cvc,

		ExpiresAt: expiresAt,
		CreatedAt: createdAt,
		UpdatedAt: updatedAt,
	}
}
