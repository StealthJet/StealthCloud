# StealthCloud

Github: https://github.com/StealthJet/StealthCloud

## What is StealthJet?

StealthJet is a subscription first protocol that can be used to create platform independent social and traditional media experiences, and apps.


This is done by interfacing with black box servers, which are accessed through a UI that allows users to sort incoming and outgoing media and data. 


StealthCloud and StealthJet are examples of black box servers and this type of UI.

## Subscription First

In the traditional web, if a website goes down, users have no way of continuing to access the content provider's content unless they had previously provided another form of contact, such as an email or phone number, or are subscribed on another platform.


In subscription first, the user provides their contact method first, such as an auth token of a server running StealthCloud, which allows the content provider to continue to provide content to them regardless if their website, or social media platforms are available. 


## Platform Independent Social Media

Unlike traditional social media that gate keeps a content provider from their subscribers, as long as a content provider maintains up to date auth tokens to their subscriber's servers, they can continue to provide content to their subscribers. 

Similarly, as long as a subscriber provides up to date auth tokens to their content providers, they can view that content in any platform experience their UI is capable of. 

In this way the social media experience is platform independent.

StealthJet is an example of a UI capable of displaying black box content as a social media experience.

## Black Box Servers

We define black box servers as servers that are encrypted at rest and in transit. At no point does the server have any awareness of the meaning of the encrypted content that goes through it. Even if a backdoor is built into the server, interested 3rd parties such as advertisers, governments, or pirates, would only find encrypted data on the server.


This is accomplished by encrypting the messages on the client side before it arrives at the server. A public-key cryptography key exchange may also happen between the UI and the server to cloak any messages in transit. Public-key cryptographic keys are also exchanged between subscribers and content providers to ensure that they, and no one else, can decrypt the content the provide to each other. 


StealthCloud is an example of a black box server.

## Spam Prevention

If a person provides their email or phone number to someone, it may be leaked, resulting in unkown parties issuing spam. 

By providing a black box server auth token, which is like a username and password generated on demand, a person knows exactly who is posting to their server, and if the auth token is leaked and spam starts to appear, they will know who is responsible and can revoke the token or provide a new one. 

This quickly prevents spam.


## Installing StealthCloud

To install run 
```
npm install
```


You will need to create a server key in the auth.JSON

## auth.JSON

The default server key has a namespace of "api".  
Change it's value to a passphrase that you will remember. You will need to remember this anytime you want to connect to the StealthCloud.

```
{
    "api": "(paste a new passphrase here)"
}
```

## Run the server

To run the server locally
```
node StealthCloud.js
```

To run on the cloud we reccomend following this tutorial: https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04