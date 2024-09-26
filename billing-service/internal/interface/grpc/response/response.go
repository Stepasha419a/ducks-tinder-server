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
