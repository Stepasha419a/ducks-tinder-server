package grpc_response

import (
	"billing-service/internal/application/mapper"
	"billing-service/proto/gen"
)

type PurchaseResponse struct {
	*mapper.PurchaseResponse
}

func (r *PurchaseResponse) ToPurchaseGrpcResponse() *gen.Purchase {
	createdAt := r.CreatedAt.Unix()

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
	expiresAt := r.ExpiresAt.Unix()
	createdAt := r.CreatedAt.Unix()
	updatedAt := r.UpdatedAt.Unix()

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
