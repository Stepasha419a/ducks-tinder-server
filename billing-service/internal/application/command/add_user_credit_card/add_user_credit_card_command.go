package add_user_credit_card

type AddUserCreditCardCommand struct {
	UserId    string
	Pan       string
	Holder    string
	Cvc       string
	ExpiresAt string
}
