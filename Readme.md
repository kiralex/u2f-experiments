# How to run
First, create a ssl certificate with 
```
openssl genrsa -out static/localhost.key 2048 
openssl req -new -x509 -key static/localhost.key -out static/localhost.cert -days 3650 -subj /CN=localhost
```

Then run 
```

```