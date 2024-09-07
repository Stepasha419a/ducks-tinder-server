package mapper

import (
	"billing-service/internal/domain/entity"
	"time"
)

type CreditCardResponse struct {
	Id        string    `json:"id"`
	UserId    string    `json:"userId"`
	Pan       string    `json:"pan"`
	Holder    string    `json:"holder"`
	Cvc       string    `json:"cvc"`
	ExpiresAt time.Time `json:"expiresAt"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func NewCreditCardResponse(creditCard *entity.CreditCard) *CreditCardResponse {
	return &CreditCardResponse{
		Id:        creditCard.Id,
		UserId:    creditCard.UserId,
		Pan:       creditCard.Pan,
		Holder:    creditCard.Holder,
		Cvc:       creditCard.Cvc,
		ExpiresAt: creditCard.ExpiresAt,
		CreatedAt: creditCard.CreatedAt,
		UpdatedAt: creditCard.UpdatedAt,
	}
}
