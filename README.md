# StealthJet Server

Github: https://github.com/StealthJet/StealthJetServer
Npm: https://www.npmjs.com/package/stealthjet

## Install

To install run 
```
npm install
```


You will need to create a TOKEN_SECRET and auth.JSON

## TOKEN_SECRET

Open a terminal and run node:
```
node
```

Then copy and paste the following:
```
const crypto = require('crypto');
const authAPI = {
    generateSalt: () => crypto.randomBytes(16).toString('hex'),
    generateJSONWebTokenSecret: () => crypto.randomBytes(64).toString('hex'),
    hashPasswordWithSalt: ({password, salt}) => crypto.pbkdf2Sync(password, salt, 100000, 64, `sha512`).toString(`hex`),
    hashPasswordToJSON: (password) => {
        const salt = authAPI.generateSalt()
        const hash = authAPI.hashPasswordWithSalt({password, salt})
        return JSON.stringify({hash, salt})
    }
}
```

Then run 
```
authAPI.generateJSONWebTokenSecret()
```

Copy the result without the surrounding single quotes and add it to the .env file.
```
TOKEN_SECRET=(paste your token secret here)
```

It should look something like this
```
TOKEN_SECRET=619e9c908a3441c5d95c39f852816529f583d8413497dd1c346ddbfbd88a176f9bc36111dc8620882599d6bb9b6393b6e366e00e8f3b10e78e66b6113688516f
```

## auth.JSON

With the authAPI still open, run the following
```
authAPI.hashPasswordToJSON('your admin password goes here')
```

Copy the result without the surrounding single quotes and paste it into the auth.JSON file. 
The result should look something like this:
```
{
    "hash":"378309452f682eedba5b5755e9ec5cad77d5ba816dae59f03757b9d2ecb331db41bcdf9bcc69d899e451affa95ba7bba36baec8874d1d1c6e18d52587f274cc4",
    "salt":"2527aa5fd1336ff8f7a6213cce2cc43f"
}
```

## Run the server

To run the server locally
```
node StealthJetServer.js
```

To run on the cloud we reccomend following this tutorial: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04