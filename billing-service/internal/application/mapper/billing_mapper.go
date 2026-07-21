package mapper

import (
	"billing-service/internal/domain/entity"
	"time"
)

type PurchaseResponse struct {
	Id     string `json:"id"`
	UserId string `json:"userId"`
	Amount int64  `json:"amount"`

	CreatedAt time.Time `json:"createdAt"`
}

func NewPurchaseResponse(purchase *entity.Purchase) *PurchaseResponse {
	return &PurchaseResponse{
		Id:     purchase.Id,
		UserId: purchase.UserId,
		Amount: purchase.Amount,

		CreatedAt: purchase.CreatedAt,
	}
}
