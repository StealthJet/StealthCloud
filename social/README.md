# Social media

To use this for hosting decentralized social media, we employ two basic concepts: Channels and Feeds.
Channels are server-side content repositories, which are viewed and updated by connecting to a server with an appropriately constructed app. The app displays Feeds, which are views of a user's channel-subscribed content, and allows interactivity to contribute new content.

## Channels

A channel is the basic unit of content hosting on social media. Analogous concepts are topics, groups, pages, circles, message boards, forums, group messages and public- or friend-visible profiles.

A social media channel consists of the following elements:
0. A private administrative suite for viewing and managing all content, approving contributors and subscribers, and setting rules for channel visibility.
1. A collection of content that is visible to all subscribers to the channel. This content can be organized arbitrarily and accessed as a static or a dynamic webpage, with a custom-programmed feed of contributors' content, filtered and ranked according to the channel owner's preferences.
2. A list of subscribers, each of whom is given a URL through which to access the channel
3. A list of authorized contributors, which can be only the owner, a list of approved content creators, or consist of all subscribers, according to the owner's preferences.
4. (Optional) A list of all subchannels, with visibility and membership inheritance rules specified by the channel owner
5. (Optional) a publicly-visible website that displays acts as a (potentially bidirectional) application that interfaces with the content server and shows a subset of the channel content to public audiences, and is capable of being web indexed and scraped, etc.

The only things the content server needs to be aware of are:
(A) the IDs under which content is stored
(B) an access list of read, write, edit and admin privileges for each item of content, and for the channel generally (this comprehends the subscriber/contributor/admin lists).

Subchannels can be stored as encrypted contents stored under directory IDs. The server need not be aware of which IDs are treated as "directory" or "pinned" or other special posts or content, and it does not have visibility into post contents or subchannels, since each subchannel is managed and accessed as a separate channel instance.
The administrative functions can be accessed via an app.
Any public-facing website or private app with its own feeds, dashboards, messaging features, etc. can be managed from the app, and so the content server need not know anything about these.

In order to host a channel, the server only needs to know about content IDs and lists of permissions controlling access for each ID.

Content is published to a channel by starting a new thread. Posts and discussion or messages can be media-rich. Contributors reply to threads by creating subthreads in tree-like fashion.
Traditional direct and private messaging can be implemented by creating a channel between two users. Note that each contributor or subscriber can be backed by a channel itself, enabling automation, feed aggregation, syndication, inherited push notifications, etc. to be implemented via thin clients running atop server instances.

A channel is a completely portable, self-hosting-capable website that completely replaces the functionality of mainstream social media portals.
If one host is disabled, the channel can be re-created from a backup and re-deployed anywhere. Importantly, it retains all content, and all contacts will be re-established by direct contact to their stored addresses.

## Feeds

Feeds are analogous to the concepts of e-mail inboxes and folders, "home" pages, messaging conversation views, etc.

The purpose of a Feed is to show a user a customized view of content from one or more source (channel) subscriptions, filtered and ranked according to the user's own custom algorithms.
Multiple feeds can be created, and all feeds are managed by the app.
If a user has contributor status, he can contribute content directly from his app or by opening and browsing his channel subscriptions.

Push notifications can be implemented by client pulling. Group conversations are handled the same as direct messages, with all members of the channel able to see every message. However, only participants in the current subtree of conversation will match the filters to receive notifications about new messages by default.
Subscribers' apps can periodically poll the server for new content by requesting updates from the channel server. When new content is discovered, the payload is delivered to the requestor. Push-style push notifications could also be implemented for supported devices, although this might come with a compromise of privacy on the server, since it would have to know how to route messages and have at least a list of subscriber IP addresses to forward notifications to. This might be best implemented as an intermediate service.

To prevent shadowbanning, it is recommended to send an encrypted acknowledgement from each subscriber every time a message is opened and read, so that contributors can monitor engagement and reach.

## Summary and Implementation Notes

A channel is a content repository with access lists, implemented as a StealthJet or other access-controlled server.
A feed is a client-side aggregator that polls channels to which a user subscribes.
Feeds enable interactivity and can receive notifications from subscribed channels.
Importantly, the power to control what appears in a user's feeds and "home" pages, and in what order, is vested entirely with the user; servers cannot mute, moderate, filter or rank content in any way.
