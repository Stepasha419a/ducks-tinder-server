package prisma_seeder

import (
	"context"
	"encoding/json"
	"os"

	"github.com/jackc/pgx/v5"
)

type (
	User struct {
		Id                  string  `json:"id" validate:"required"`
		Name                string  `json:"email" validate:"required"`
		Description         *string `json:"description"`
		Nickname            *string `json:"nickname"`
		IsActivated         bool    `json:"isActivated" validate:"required"`
		Age                 *int8   `json:"age"`
		Sex                 *string `json:"sex"`
		CreatedAt           string  `json:"createdAt" validate:"required"`
		UpdatedAt           string  `json:"updatedAt" validate:"required"`
		Distance            *int8   `json:"distance"`
		UsersOnlyInDistance bool    `json:"usersOnlyInDistance" validate:"required"`
		PreferSex           *bool   `json:"preferSex"`
		PreferAgeFrom       *int8   `json:"preferAgeFrom"`
		PreferAgeTo         *int8   `json:"preferAgeTo"`

		ZodiacSign             *string `json:"zodiacSign"`
		Education              *string `json:"education"`
		AlcoholAttitude        *string `json:"alcoholAttitude"`
		Chronotype             *string `json:"chronotype"`
		FoodPreference         *string `json:"foodPreference"`
		Pet                    *string `json:"pet"`
		SmokingAttitude        *string `json:"smokingAttitude"`
		SocialNetworksActivity *string `json:"socialNetworksActivity"`
		TrainingAttitude       *string `json:"trainingAttitude"`
		ChildrenAttitude       *string `json:"childrenAttitude"`
		PersonalityType        *string `json:"personalityType"`
		CommunicationStyle     *string `json:"communicationStyle"`
		AttentionSign          *string `json:"attentionSign"`
	}
)

func seedUsers(ctx context.Context, tx pgx.Tx) error {
	users := getUsersSeedData()

	_, err := tx.Exec(ctx, "TRUNCATE TABLE auth_users")
	if err != nil {
		return err
	}

	query := "INSERT INTO users (id, email, password, refreshToken, createdAt, updatedAt) VALUES (@id, @email, @password, @refreshToken, @createdAt, @updatedAt)"

	batch := &pgx.Batch{}

	for _, user := range users {
		args := pgx.NamedArgs{
			"id":                     user.Id,
			"name":                   user.Name,
			"description":            user.Description,
			"nickname":               user.Nickname,
			"isActivated":            user.IsActivated,
			"age":                    user.Age,
			"sex":                    user.Sex,
			"distance":               user.Distance,
			"usersOnlyInDistance":    user.UsersOnlyInDistance,
			"preferSex":              user.PreferSex,
			"preferAgeFrom":          user.PreferAgeFrom,
			"preferAgeTo":            user.PreferAgeTo,
			"zodiacSign":             user.ZodiacSign,
			"education":              user.Education,
			"alcoholAttitude":        user.AlcoholAttitude,
			"chronotype":             user.Chronotype,
			"foodPreference":         user.FoodPreference,
			"pet":                    user.Pet,
			"smokingAttitude":        user.SmokingAttitude,
			"socialNetworksActivity": user.SocialNetworksActivity,
			"trainingAttitude":       user.TrainingAttitude,
			"childrenAttitude":       user.ChildrenAttitude,
			"personalityType":        user.PersonalityType,
			"communicationStyle":     user.CommunicationStyle,
			"attentionSign":          user.AttentionSign,
			"createdAt":              user.CreatedAt,
			"updatedAt":              user.UpdatedAt,
		}

		batch.Queue(query, args)
	}

	results := tx.SendBatch(ctx, batch)
	defer results.Close()

	for range users {
		_, err := results.Exec()
		if err != nil {
			return err
		}
	}

	return nil
}

func getUsersSeedData() []User {
	bytes, err := os.ReadFile("data/prisma_postgres/users.json")
	if err != nil {
		panic(err)
	}

	users := []User{}
	err = json.Unmarshal(bytes, &users)
	if err != nil {
		panic(err)
	}

	return users
}
