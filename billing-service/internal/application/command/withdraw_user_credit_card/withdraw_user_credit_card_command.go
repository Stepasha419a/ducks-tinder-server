package withdraw_user_credit_card

type WithdrawUserCreditCardCommand struct {
	UserId       string
	CreditCardId string
	Amount       int64
}
