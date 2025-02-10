package map_service_seeder

import (
	"context"
	database_service "database-seeder/internal/service/database"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type (
	Location struct {
		Id          string
		Latitude    float64
		Longitude   float64
		City        string
		Country     string
		AdminRegion string
		Capital     string

		CreatedAt time.Time
	}
)

func SeedMapServicePostgres(instance *database_service.MapServicePostgresInstance) error {
	ctx := context.Background()

	tx, err := instance.Conn.Begin(ctx)

	defer func() {
		if err != nil {
			tx.Rollback(ctx)
		} else {
			tx.Commit(ctx)
		}
	}()

	if err != nil {
		return err
	}

	err = seedLocations(ctx, tx)
	if err != nil {
		return err
	}

	return nil
}

func seedLocations(ctx context.Context, tx pgx.Tx) error {
	rows, err := getData()
	if err != nil {
		return err
	}

	locations, err := prepareRows(rows)
	if err != nil {
		return err
	}

	log.Print("seed map service postgres - truncating tables")

	_, err = tx.Exec(ctx, "TRUNCATE TABLE locations CASCADE")
	if err != nil {
		return err
	}

	log.Print("seed map service postgres - seeding")

	err = insertQueryFromRows(ctx, tx, locations)
	if err != nil {
		return err
	}

	return nil
}

func insertQueryFromRows(ctx context.Context, tx pgx.Tx, locations *[]*Location) error {
	query := `INSERT INTO locations (
		id, 
		latitude, 
		longitude, 
		city, 
		country, 
		admin_region, 
		capital, 
		created_at
	) VALUES (
		@id,
		@latitude,
		@longitude,
		@city,
		@country,
		@admin_region,
		@capital,
		@created_at
	)`

	batch := &pgx.Batch{}
	for _, location := range *locations {
		var capital *string = nil
		if location.Capital != "" {
			capital = &location.Capital
		}

		args := pgx.NamedArgs{
			"id":           location.Id,
			"latitude":     location.Latitude,
			"longitude":    location.Longitude,
			"city":         location.City,
			"country":      location.Country,
			"admin_region": location.AdminRegion,
			"capital":      capital,
			"created_at":   location.CreatedAt,
		}

		batch.Queue(query, args)
	}

	results := tx.SendBatch(ctx, batch)
	defer results.Close()

	for range *locations {
		_, err := results.Exec()
		if err != nil {
			return err
		}
	}

	return results.Close()
}

func prepareRows(rows *string) (*[]*Location, error) {
	list := []*Location{}

	for _, row := range strings.Split(*rows, "\n")[1:] {
		if len(row) == 0 {
			continue
		}

		location, err := getLocationFromStringRow(row)
		if err != nil {
			return nil, err
		}

		list = append(list, location)
	}

	return &list, nil
}

func getLocationFromStringRow(row string) (*Location, error) {
	data := getSeparatedRow(row)

	city := getString(data[0])

	latitude, err := getFloatFromString(data[2])
	if err != nil {
		return nil, err
	}

	longitude, err := getFloatFromString(data[3])
	if err != nil {
		return nil, err
	}

	country := getString(data[4])
	AdminRegion := getString(data[7])
	capital := getString(data[8])

	return &Location{
		Id:          uuid.NewString(),
		Latitude:    latitude,
		Longitude:   longitude,
		City:        city,
		Country:     country,
		AdminRegion: AdminRegion,
		Capital:     capital,
		CreatedAt:   time.Now(),
	}, nil
}

func getSeparatedRow(row string) []string {
	separatedRow := []string{}

	start := 0
	inString := false

	for i, symbol := range row {
		if symbol == ',' {
			start = i + 1
			continue
		}

		if symbol == '"' {
			inString = !inString
		}

		if !inString && i != 0 {
			separatedRow = append(separatedRow, row[start:i+1])
		}

		if len(separatedRow) == 11 {
			break
		}
	}

	return separatedRow
}

func getFloatFromString(value string) (float64, error) {
	return strconv.ParseFloat(getString(value), 64)
}

func getString(value string) string {
	return strings.ReplaceAll(value, "\"", "")
}

func getData() (*string, error) {
	filePath := "data/map_service_postgres/locations.csv"
	_, err := os.Stat(filePath)
	if err != nil {
		log.Print("seed map service postgres - no data file provided")
		return nil, err
	}

	bytes, err := os.ReadFile("data/map_service_postgres/locations.csv")
	if err != nil {
		return nil, err
	}

	rows := string(bytes)

	return &rows, nil
}
