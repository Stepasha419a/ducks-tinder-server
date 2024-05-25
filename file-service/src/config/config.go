package config

import (
	"fmt"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

func RequireEnv() {
	err := godotenv.Load(".env")

	if err != nil {
		panic("Error loading .env file")
	}

	binaryData, err := os.ReadFile(".env.example")
	if err != nil {
		panic(err)
	}
	data := string(binaryData)
	requiredVars := strings.Split(strings.ReplaceAll(data, "\r\n", "\n"), "\n")

	for _, requiredVar := range requiredVars {
		trimmedValue := strings.Trim(requiredVar, " ")
		if trimmedValue == "" {
			continue
		}

		value := os.Getenv(requiredVar)
		if value == "" {
			panic(fmt.Errorf("%v env value is required", requiredVar))
		}
	}
}
