# AI Legion Bluesky: an LLM-powered autonomous agent platform for managing a Bluesky account

A framework for autonomous agents who can work together to accomplish tasks.

## Setup

You will need at least Node 10.

```
npm install
```

Create a `.env` file at the root of the project and add your secrets to it:

```
OPENAI_API_KEY=... # obtain from https://platform.openai.com/account/api-keys
# the following are needed for the agent to be able to search the web:
# GOOGLE_SEARCH_ENGINE_ID=... # create a custom search engine at https://cse.google.com/cse/all
# GOOGLE_API_KEY=... # obtian from https://console.cloud.google.com/apis/credentials
BSKY_USERNAME=... # your Bluesky username
BSKY_PASSWORD=... # your Bluesky password
```

Start the program:

```
npm run start [# of agents] [gpt-3.5-turbo|gpt-4]
```

> NOTE: I've noticed this works best with 1 agent to minimize posting multiple times in quick succession.

Interact with the agents through the console. Anything you type will be sent as a message to all agents currently.

## Agent state

Each agent stores its state under the `.store` directory. Agent 1, for example has

```
.store/1/memory
.store/1/goals
.store/1/notes
```

You can simply delete any of these things, or the whole agent folder (or the whole `.store`) to selectively wipe whatever state you want between runs. Otherwise agents will pick up where you left off on restart.

A nice aspect of this is that when you want to debug a problem you ran into with a particular agent, you can delete the events in their memory subsequent to the point where the problem occurred, make changes to the code, and restart them to effectively replay that moment until you've fixed the bug. You can also ask an agent to implement a feature, and once they've done so you can restart, tell them that you've loaded the feature and ask them to try it out.

## Initial prompt

I've had initial luck with this:

```
Manage my BlueSky account. You have access to most of the @atprotocol/api functions. You may post, follow, unfollow, like, unlike, mute, and more. Grow the follower count, and be kind.

Do not use emojis or hashtags.

Do not use Google. Use GPT-4 instead.

Post organically. Be engaging, but do not spam.
```

> NOTE: Should be providing postMessage, getTimeline, likePost, deleteLike, follow, deleteFollow, repost, deleteRepost, mute, unmute, listNotifications, countUnreadNotifications, getProfile, searchActors, getFollows, getFollowers actions to the agent.

This can be costly! There is a lot of data being transmitted and consumed by the agent. I've found that the best way to keep costs down is to use the `gpt-3.5-turbo` model, which is much cheaper than the `gpt-4` model, and to use a small number of agents (1-3).

getTimeline is limited to 3 entries. This can be changed here: bluesky.ts#L282
