package main

import (
	"log"
	"net/http"
  "net/url"
	"os"
  "io"
  "fmt"
  "strconv"
  "encoding/base64"
  "crypto/rand"

  "github.com/gorilla/mux"
  "github.com/gorilla/sessions"
  "golang.org/x/oauth2"
  //gopkg.in/boj/redistore.v1
)

var conf = &oauth2.Config{
  ClientID:     os.Getenv("YAHOO_CLIENTID"),
  ClientSecret: os.Getenv("YAHOO_SECRET"),
  Scopes:       []string{},
  Endpoint: oauth2.Endpoint{
    AuthURL:  "https://api.login.yahoo.com/oauth2/request_auth",
    TokenURL: "https://api.login.yahoo.com/oauth2/get_token",
  },
  RedirectURL: "http://vfootballogic.azurewebsites.net/auth/yahoo/callback",
}

// randomString returns a random string with the specified length
func randomString(length int) (str string) {
	b := make([]byte, length)
	rand.Read(b)
	return base64.StdEncoding.EncodeToString(b)
}

// store initializes the Gorilla session store.
var store = sessions.NewCookieStore([]byte(randomString(32)))
//var sessionStore *sessions.Store

func HomeHandler(w http.ResponseWriter, r *http.Request) {
  session, err := store.Get(r, "session-name")
  if err != nil {
		log.Println("error fetching session:", err)
	}
  state := randomString(64)
	session.Values["state"] = state
	session.Save(r, w)

  fmt.Fprint(w, "<h1>Hello</h1><a href='/auth/yahoo'>Login With Yahoo</a>")
}

func AuthYahoo(w http.ResponseWriter, r *http.Request) {
  session, err := store.Get(r, "session-name")
  if err != nil {
        http.Error(w, err.Error(), 500)
        return
  }

  // Redirect user to consent page to ask for permission
	// for the scopes specified above.
  urlStr := conf.AuthCodeURL(session.Values["state"].(string), oauth2.AccessTypeOnline)
  urlStrUnesc, err := url.QueryUnescape(urlStr)
  if err!=nil {
    log.Println(err)
  }
  log.Printf("Visit the URL for the auth dialog: %v", urlStrUnesc)

  http.Redirect(w, r, urlStrUnesc, 302)
}

func AuthYahooCallback(w http.ResponseWriter, r *http.Request) {
  session, err := store.Get(r, "session-name")
  if err != nil {
        http.Error(w, err.Error(), 500)
        return
  }
  // Use the authorization code that is pushed to the redirect URL.
  // NewTransportWithCode will do the handshake to retrieve
  // an access token and initiate a Transport that is
  // authorized and authenticated by the retrieved token.
  code := r.FormValue("code")

  tok, err := conf.Exchange(oauth2.NoContext, code)
  if err != nil {
  	log.Fatal(err)
  }
  session.Values["accessToken"] = tok.AccessToken
  session.Values["xoauth_yahoo_guid"] = r.FormValue("xoauth_yahoo_guid")
  session.Save(r, w)

  client := conf.Client(oauth2.NoContext, tok)
  resp, err := client.Get("https://fantasysports.yahooapis.com/fantasy/v2/game/nfl")
  io.Copy(w, resp.Body)

  //http.Redirect(w, r, "/", 302)
}

func main() {
  port, err := strconv.Atoi(os.Getenv("PORT"))
  if err!=nil {
    log.Printf("Bad port: '%s', using 8080", os.Getenv("PORT"))
    // log.Fatal("$PORT must be set")
    port = 8088
  }

  // if store, err := NewRediStore(size int, network, address, password string, keyPairs ...[]byte) (*RediStore, error); err!=nil {
  //   log.Fatal("Unable to connect to Redis", err)
  // } else {
  //   sessionStore = store
  // }
  // defer sessionStore.Close()

  r := mux.NewRouter()
  r.HandleFunc("/", HomeHandler)
  r.HandleFunc("/auth/yahoo", AuthYahoo)
  r.HandleFunc("/auth/yahoo/callback", AuthYahooCallback)
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./wwwroot/")))
  // r.HandleFunc("/articles", ArticlesHandler)
  http.Handle("/", r)

  log.Fatal(http.ListenAndServe(":"+strconv.Itoa(port), nil))
}
