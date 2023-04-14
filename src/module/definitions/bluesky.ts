import { defineModule } from "../define-module";
import { messageBuilder } from "../../message";

import { BskyAgent, RichText } from "@atproto/api";

export default defineModule({
  name: "bluesky",
}).with({
  actions: {
    post: {
      description: "Post to bluesky",
      parameters: {
        text: {
          description: "The text to post",
        },
      },
      async execute({
        parameters: { text },
        context: { agentId },
        sendMessage,
      }) {
        try {
          await postMessage(text);
          sendMessage(messageBuilder.ok(agentId, `Posted to bluesky.`));
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    getTimeline: {
      description: "Get timeline from bluesky",
      async execute({ context: { agentId }, sendMessage }) {
        try {
          const timeline = await getTimeline();
          sendMessage(
            messageBuilder.ok(
              agentId,
              `Retrieved timeline: ${JSON.stringify(timeline)}`
            )
          );
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    like: {
      description: "Like a post on bluesky",
      parameters: {
        uri: {
          description: "The URI of the post to like",
        },
        cid: {
          description: "The CID of the post to like",
        },
      },
      async execute({
        parameters: { uri, cid },
        context: { agentId },
        sendMessage,
      }) {
        try {
          await likePost(uri, cid);
          sendMessage(messageBuilder.ok(agentId, `Liked post: ${uri}`));
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    deleteLike: {
      description: "Delete a like on a post on bluesky",
      parameters: {
        likeUri: {
          description: "The URI of the like to delete",
        },
      },
      async execute({
        parameters: { likeUri },
        context: { agentId },
        sendMessage,
      }) {
        try {
          await deleteLike(likeUri);
          sendMessage(messageBuilder.ok(agentId, `Deleted like: ${likeUri}`));
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    follow: {
      description: "Follow an actor on bluesky",
      parameters: {
        subjectDid: {
          description: "The DID of the actor to follow",
        },
      },
      async execute({
        parameters: { subjectDid },
        context: { agentId },
        sendMessage,
      }) {
        try {
          await follow(subjectDid);
          sendMessage(
            messageBuilder.ok(agentId, `Followed actor: ${subjectDid}`)
          );
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    deleteFollow: {
      description: "Delete a follow on an actor on bluesky",
      parameters: {
        followUri: {
          description: "The URI of the follow to delete",
        },
      },
      async execute({
        parameters: { followUri },
        context: { agentId },
        sendMessage,
      }) {
        try {
          await deleteFollow(followUri);
          sendMessage(
            messageBuilder.ok(agentId, `Deleted follow: ${followUri}`)
          );
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    repost: {
      description: "Repost a post on bluesky",
      parameters: {
        uri: {
          description: "The URI of the post to repost",
        },
        cid: {
          description: "The CID of the post to repost",
        },
      },
      async execute({
        parameters: { uri, cid },
        context: { agentId },
        sendMessage,
      }) {
        try {
          await repost(uri, cid);
          sendMessage(messageBuilder.ok(agentId, `Reposted post: ${uri}`));
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    deleteRepost: {
      description: "Delete a repost on a post on bluesky",
      parameters: {
        repostUri: {
          description: "The URI of the repost to delete",
        },
      },
      async execute({
        parameters: { repostUri },
        context: { agentId },
        sendMessage,
      }) {
        try {
          await deleteRepost(repostUri);
          sendMessage(
            messageBuilder.ok(agentId, `Deleted repost: ${repostUri}`)
          );
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    mute: {
      description: "Mute an actor on bluesky",
      parameters: {
        actor: {
          description: "The DID of the actor to mute",
        },
      },
      async execute({
        parameters: { actor },
        context: { agentId },
        sendMessage,
      }) {
        try {
          await mute(actor);
          sendMessage(messageBuilder.ok(agentId, `Muted actor: ${actor}`));
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    unmute: {
      description: "Unmute an actor on bluesky",
      parameters: {
        actor: {
          description: "The DID of the actor to unmute",
        },
      },
      async execute({
        parameters: { actor },
        context: { agentId },
        sendMessage,
      }) {
        try {
          await unmute(actor);
          sendMessage(messageBuilder.ok(agentId, `Unmuted actor: ${actor}`));
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    listNotifications: {
      description: "List notifications from bluesky",
      async execute({ context: { agentId }, sendMessage }) {
        try {
          const notifications = await listNotifications();
          sendMessage(
            messageBuilder.ok(
              agentId,
              `Retrieved notifications: ${JSON.stringify(notifications)}`
            )
          );
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    countUnreadNotifications: {
      description: "Count unread notifications from bluesky",
      async execute({ context: { agentId }, sendMessage }) {
        try {
          const count = await countUnreadNotifications();
          sendMessage(
            messageBuilder.ok(agentId, `Unread notifications count: ${count}`)
          );
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    getProfile: {
      description: "Get the profile of an actor on bluesky",
      parameters: {
        actor: {
          description: "The DID of the actor whose profile to retrieve",
        },
      },
      async execute({
        parameters: { actor },
        context: { agentId },
        sendMessage,
      }) {
        try {
          const profile = await getProfile(actor);
          sendMessage(
            messageBuilder.ok(
              agentId,
              `Retrieved profile: ${JSON.stringify(profile)}`
            )
          );
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    searchActors: {
      description: "Search actors on bluesky",
      parameters: {
        query: {
          description: "The query to search for actors",
        },
      },
      async execute({
        parameters: { query },
        context: { agentId },
        sendMessage,
      }) {
        try {
          const actors = await searchActors(query);
          sendMessage(
            messageBuilder.ok(
              agentId,
              `Retrieved actors: ${JSON.stringify(actors)}`
            )
          );
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    getFollows: {
      description: "Get follows of an actor on bluesky",
      parameters: {
        actor: {
          description: "The DID of the actor to get follows for",
        },
      },
      async execute({
        parameters: { actor },
        context: { agentId },
        sendMessage,
      }) {
        try {
          const follows = await getFollows(actor);
          sendMessage(
            messageBuilder.ok(
              agentId,
              `Retrieved follows: ${JSON.stringify(follows)}`
            )
          );
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
    getFollowers: {
      description: "Get followers of an actor on bluesky",
      parameters: {
        actor: {
          description: "The DID of the actor to get followers for",
        },
      },
      async execute({
        parameters: { actor },
        context: { agentId },
        sendMessage,
      }) {
        try {
          const followers = await getFollowers(actor);
          sendMessage(
            messageBuilder.ok(
              agentId,
              `Retrieved followers: ${JSON.stringify(followers)}`
            )
          );
        } catch (err) {
          sendMessage(messageBuilder.error(agentId, JSON.stringify(err)));
        }
      },
    },
  },
});

async function createAgent(): Promise<BskyAgent> {
  const agent = new BskyAgent({
    service: "https://bsky.social",
  });

  await agent.login({
    identifier: process.env.BSKY_USERNAME!,
    password: process.env.BSKY_PASSWORD!,
  });

  return agent;
}

export async function postMessage(text: string) {
  const agent = await createAgent();
  const rt = new RichText({
    text,
  });
  await rt.detectFacets(agent);

  const postRecord = {
    $type: "app.bsky.feed.post",
    text: rt.text,
    facets: rt.facets,
    createdAt: new Date().toISOString(),
  };

  await agent.post(postRecord);
}

export async function getTimeline() {
  const agent = await createAgent();
  const timeline = await agent.getTimeline({ limit: 3 });
  // // for each item in the timeline get only the post text, cid, and author
  // const _timeline = timeline.data.feed.map((item) => {
  //   return {
  //     uri: item.post.uri,
  //     cid: item.post.cid,
  //     author: item.post.author.displayName,
  //     record: item.post.record,
  //   };
  // });
  return timeline;
}

export async function likePost(uri: string, cid: string) {
  const agent = await createAgent();
  await agent.like(uri, cid);
}

export async function deleteLike(likeUri: string) {
  const agent = await createAgent();
  await agent.deleteLike(likeUri);
}

export async function follow(subjectDid: string) {
  const agent = await createAgent();
  await agent.follow(subjectDid);
}

export async function deleteFollow(followUri: string) {
  const agent = await createAgent();
  await agent.deleteFollow(followUri);
}

export async function repost(uri: string, cid: string) {
  const agent = await createAgent();
  await agent.repost(uri, cid);
}

export async function deleteRepost(repostUri: string) {
  const agent = await createAgent();
  await agent.deleteRepost(repostUri);
}

export async function mute(actor: string) {
  const agent = await createAgent();
  await agent.mute(actor);
}

export async function unmute(actor: string) {
  const agent = await createAgent();
  await agent.unmute(actor);
}

export async function listNotifications() {
  const agent = await createAgent();
  const notifications = await agent.listNotifications();
  return notifications;
}

export async function countUnreadNotifications() {
  const agent = await createAgent();
  const count = await agent.countUnreadNotifications();
  return count;
}

export async function getProfile(actor: string) {
  const agent = await createAgent();
  const profile = await agent.getProfile({ actor });
  return profile;
}

export async function searchActors(term: string) {
  const agent = await createAgent();
  const actors = await agent.searchActors({ term });
  return actors;
}

export async function getFollows(actor: string) {
  const agent = await createAgent();
  const follows = await agent.getFollows({ actor });
  return follows;
}

export async function getFollowers(actor: string) {
  const agent = await createAgent();
  const followers = await agent.getFollowers({ actor });
  return followers;
}

