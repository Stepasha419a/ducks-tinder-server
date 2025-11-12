package image_service

import (
	"fmt"

	"github.com/h2non/bimg"
)

func ConvertToWebP(input []byte) ([]byte, error) {
	img := bimg.NewImage(input)

	options := bimg.Options{
		Type:          bimg.WEBP,
		Quality:       80,
		StripMetadata: true, // removes EXIF, IPTC, ICC — saves space
	}

	converted, err := img.Process(options)
	if err != nil {
		return nil, fmt.Errorf("failed to process image: %w", err)
	}

	return converted, nil
}
