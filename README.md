# StealthServer

Github: https://github.com/StealthJet/StealthServer

Npm: https://www.npmjs.com/package/stealthjet

## What is StealthJet?

StealthJet is a subscription first protocol that can be used to create platform independent social and traditional media experiences, and apps.


This is done by interfacing with black box servers, which are accessed through a UI that allows users to sort incoming and outgoing media and data. 


StealthServer and StealthJet Dashboard are examples of black box servers and this type of UI.

## Subscription First

In the traditional web, if a website goes down, users have no way of continuing to access the content provider's content unless they had previously provided another form of contact, such as an email or phone number, or are subscribed on another platform.


In subscription first, the user provides their contact method first, such as an auth token of a server running StealthJet Server, which allows the content provider to continue to provide content to them regardless if their website, or social media platforms are available. 


## Platform Independent Social Media

Unlike traditional social media that gate keeps a content provider from their subscribers, as long as a content provider maintains up to date auth tokens to their subscriber's servers, they can continue to provide content to their subscribers. 

Similarly, as long as a subscriber provides up to date auth tokens to their content providers, they can view that content in any platform experience their UI is capable of. 

In this way the social media experience is platform independent.

StealthJet Dashboard is an example of a UI capable of displaying black box content as a social media experience.

## Black Box Servers

We define black box servers as servers that are encrypted at rest and in transit. At no point does the server have any awareness of the meaning of the encrypted content that goes through it. Even if a backdoor is built into the server, interested 3rd parties such as advertisers, governments, or pirates, would only find encrypted data on the server.


This is accomplished by encrypting the messages on the client side before it arrives at the server. A public-key cryptography key exchange may also happen between the UI and the server to cloak any messages in transit. Public-key cryptographic keys are also exchanged between subscribers and content providers to ensure that they, and no one else, can decrypt the content the provide to each other. 


StealthServer is an example of a black box server.

## Spam Prevention

If a person provides their email or phone number to someone, it may be leaked, resulting in unkown parties issuing spam. 

By providing a black box server auth token, which is like a username and password generated on demand, a person knows exactly who is posting to their server, and if the auth token is leaked and spam starts to appear, they will know who is responsible and can revoke the token or provide a new one. 

This quickly prevents spam.


## Installing StealthJet Server

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
node StealthServer.js
```

To run on the cloud we reccomend following this tutorial: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04