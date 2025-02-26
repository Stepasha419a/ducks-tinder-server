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
		UserId:       r.UserId,
		CreditCardId: r.CreditCardId,
		Amount:       r.Amount,
		CreatedAt:    createdAt,
	}
}
