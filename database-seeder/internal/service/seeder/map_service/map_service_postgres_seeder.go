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
