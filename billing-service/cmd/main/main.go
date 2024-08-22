package main

import "fmt"

func main() {
	container, cleaner, err := newContainer()
	if err != nil {
		panic(err)
	}

	defer cleaner()
	fmt.Println(container.ConfigService.GetConfig())
}
