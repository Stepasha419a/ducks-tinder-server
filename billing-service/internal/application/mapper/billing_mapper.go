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

type PurchaseResponse struct {
	Id           string `json:"id"`
	CreditCardId string `json:"creditCardId"`
	Amount       int64  `json:"amount"`

	CreatedAt time.Time `json:"createdAt"`
}

func NewPurchaseResponse(purchase *entity.Purchase) *PurchaseResponse {
	return &PurchaseResponse{
		Id:           purchase.Id,
		CreditCardId: purchase.CreditCardId,
		Amount:       purchase.Amount,

		CreatedAt: purchase.CreatedAt,
	}
}
