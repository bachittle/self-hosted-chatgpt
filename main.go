// one-file web server interfacing with openai api

package main

import (
	"fmt"
	"net/http"

	"github.com/alecthomas/kong"
)

var cli struct {
	SetKey string          `help:"Set OpenAI API key."`
	Run    RunWebServerCmd `cmd:"" help:"Run the web server."`
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
