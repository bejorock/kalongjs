module.exports = {
  "initial:before": {
    "loopback#favicon": {
      "params": "favicon.ico"
    }
  },
  "initial": {
    "compression": {},
    "cors": {
      "params": {
        "origin": true,
        "credentials": true,
        "maxAge": 86400
      }
    },
    "helmet#xssFilter": {},
    "helmet#frameguard": {
      "params": [
        "deny"
       ]
    },
    "helmet#hsts": {
      "params": {
        "maxAge": 0,
        "includeSubdomains": true
      }
    },
    "helmet#hidePoweredBy": {},
    "helmet#ieNoOpen": {},
    "helmet#noSniff": {},
    "helmet#noCache": {
      "enabled": false
    }
  },
  "initial:after":{},
  "session": {},
  "auth": {
    "loopback#token": {}
  },
  "parse": {},
  "routes": {
    "loopback#rest": {
      "paths": [
        "${restApiRoot}"
      ]
    }
  },
  "files": {},
  "final:before": {

  },
  "final": {
    "loopback#urlNotFound": {}
  },
  "final:after": {
    "strong-error-handler": {}
  }
}