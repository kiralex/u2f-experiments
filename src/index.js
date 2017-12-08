import express from "express";
import https from "https";
import fs from "fs";
import bodyparser from "body-parser";
import session from "express-session";
import appRoot from "app-root-path";
import http from "http";

import { registration, checkRegistration } from "./u2f-server";

const app = express();

// use sessions
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "secret"
  })
);

// use https
app.use((req, res, next) => {
  if (!req.secure) return res.redirect("https://" + req.get("host") + req.url);
  next();
});

// use bodyparser
app.use(
  bodyparser.urlencoded({
    extended: false
  })
);
app.use(bodyparser.json());

// u2f handlers
app.get("/register", registration);
app.post("/check", checkRegistration);

app.get("/", function(req, res) {
  res.sendFile("index.html", {
    root: __dirname
  });
});

// static files
app.use("/static", express.static(appRoot + "/static"));

// run http server
http.createServer(app).listen(80);

// run https server
var options = {
  key: fs.readFileSync(appRoot + "/certs/localhost.key"),
  cert: fs.readFileSync(appRoot + "/certs/localhost.cert"),
  requestCert: false,
  rejectUnauthorized: false
};
https.createServer(options, app).listen(443, function() {
  console.log("Example app listening on port 3000!");
});
