// one-file web server interfacing with openai api

package main

import (
	"fmt"
	"net/http"

	"github.com/alecthomas/kong"

	"github.com/joho/godotenv"
)

var cli struct {
	Key KeyCmd          `cmd:"" help:"Either set OpenAI API key, or get the key that is saved."`
	Run RunWebServerCmd `cmd:"" help:"Run the web server."`
}

const APP_VERSION = "0.0.1"

func main() {
	ctx := kong.Parse(&cli,
		kong.Name("openai-server"),
		kong.Description("One-file web server interfacing with openai api."),
		kong.UsageOnError(),
		kong.Vars{"version": APP_VERSION},
	)
	err := ctx.Run()
	ctx.FatalIfErrorf(err)
}

type KeyCmd struct {
	Value string `arg:"" optional:"" help:"Override the OpenAI API key with this value."`
}

func (s *KeyCmd) Run() error {
	if s.Value == "" {
		fmt.Println("getting the env var from .env file...")
		val, err := getApiKey()
		if err != nil {
			fmt.Println("Error getting OpenAI API key: ", err)
			return err
		}
		s.Value = val

	} else {
		fmt.Println("setting the env var using value given...")
		err := setApiKey(s.Value)
		if err != nil {
			fmt.Println("Error setting OpenAI API key: ", err)
			return err
		}
	}
	fmt.Println("OpenAI API key: ", s.Value)
	return nil
}

func getApiKey() (string, error) {
	env, err := godotenv.Read(".env")
	if err != nil {
		return "", err
	}
	return env["OPENAI_API_KEY"], nil
}

func setApiKey(val string) error {
	err := godotenv.Write(map[string]string{"OPENAI_API_KEY": val}, ".env")
	if err != nil {
		return err
	}
	return nil
}

type RunWebServerCmd struct {
	Port int `help:"Port to listen on." default:"8080"`
}

func (r *RunWebServerCmd) Run() error {
	fmt.Println("Running web server on port", r.Port)

	http.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, world!"))
	})
	http.ListenAndServe(fmt.Sprintf(":%d", r.Port), nil)

	return nil
}
