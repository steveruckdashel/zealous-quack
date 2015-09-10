package main

import (
	"crypto/rand"
	"encoding/base64"
	"github.com/steveruckdashel/zealous-quack/Godeps/_workspace/src/github.com/gorilla/mux"
	"github.com/steveruckdashel/zealous-quack/Godeps/_workspace/src/github.com/gorilla/sessions"
	"github.com/steveruckdashel/zealous-quack/Godeps/_workspace/src/github.com/steveruckdashel/yahooapi"
	redistore "github.com/steveruckdashel/zealous-quack/Godeps/_workspace/src/gopkg.in/boj/redistore.v1"
	"html/template"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
)

var Views *template.Template

// randomString returns a random string with the specified length
func randomString(length int) (str string) {
	b := make([]byte, length)
	rand.Read(b)
	return base64.StdEncoding.EncodeToString(b)
}

// store initializes the Gorilla session store.
var store sessions.Store

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	var session *sessions.Session
	s, err := store.Get(r, "session-name")
	if err != nil {
		log.Println("error fetching session:", err)
		s, _ := store.New(r, "session-name")
		session = s
	} else {
		session = s
	}
	state := randomString(64)
	session.Values["state"] = state
	session.Save(r, w)

	if err := Views.Lookup("home.ghtml").Execute(w, struct{}{}); err != nil {
		log.Printf("error executing view template: %v", err)
	}
}

func main() {
	Views = template.New("Home")
	if _, err := Views.ParseGlob("./views/*.ghtml"); err != nil {
		log.Fatalf("invalid view, %v", err)
	}

	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		log.Fatal("Bad port: '%s'", os.Getenv("PORT"))
	}

	//store = sessions.NewCookieStore([]byte(randomString(32)))
	if u, err := url.Parse(os.Getenv("REDIS_URL")); err != nil || u.Host == "" {
		store = sessions.NewCookieStore([]byte(randomString(32)))
	} else {
		var address = url.URL{
			User: url.User(u.User.Username()),
			Host: u.Host,
		}
		pass, _ := u.User.Password()
		if st, e := redistore.NewRediStore(5, "tcp", address.String(), pass); e != nil {
			log.Fatal("Unable to connect to Redis", e)
		} else {
			store = st
			defer st.Close()
		}
	}

	r := mux.NewRouter()
	r.HandleFunc("/", HomeHandler)

	client := os.Getenv("YAHOO_CLIENTID")
	secret := os.Getenv("YAHOO_SECRET")
	yapi := yahooapi.NewYahooConfig(client, secret, []string{}, "http://limitless-refuge-3809.herokuapp.com", "/", store)
	yapi.RegisterRoutes(r)

	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./wwwroot/")))
	http.Handle("/", r)

	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(port), nil))
}
