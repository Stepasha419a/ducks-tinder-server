package crypto_service

import (
	"crypto/sha512"
	"encoding/hex"
)

func Hash(value string, salt []byte) string {
	bytesValue := []byte(value)

	sha512Hasher := sha512.New()

	saltedValue := append(bytesValue, salt...)

	sha512Hasher.Write(saltedValue)

	hashedValue := sha512Hasher.Sum(nil)
	hashedString := hex.EncodeToString(hashedValue)

	return hashedString
}

func Compare(value string, hash string, salt []byte) bool {
	valueHash := Hash(value, salt)

	return hash == valueHash
}
