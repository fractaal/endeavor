import { Module } from '@/interfaces/Section';
import { Discussion } from '@/interfaces/Discussion';
import { transformUrl } from './content-presentation';
import store from '../store';

export async function canPost(module: Module) {
  const res = await store.eLearn.wsFunction('mod_forum_can_add_discussion', {forumid: module.id});
  return !!res.status;
}

function findNodeInTree(discussion: Discussion, id: number) {
  if (discussion.id == id) {
    return discussion;
  } else if (discussion.children.length != 0) {
    for (const child of discussion.children) {
      const found = findNodeInTree(child, id);
      if (found) return found;
    }
  }
}

/**
 * Builds a discussion tree with a singular top node. It builds this tree by matching IDs.
 * 
 * Why eLearn decides to send data like this instead of just doing it the sensible way,
 * I don't know. Why ??????????? 
 * @param discussions 
 */
async function buildDiscussionTree(discussions: Discussion[]): Promise<Discussion> {
  let topNode: Discussion;
  while (discussions.length != 0) {
    for (const [idx, discussion] of Object.entries(discussions)) {
      if (!discussion.hasparent && !topNode) {
        topNode = discussion;
        discussions.splice(parseInt(idx), 1);
        break;
      } else if (!discussion.hasparent && topNode) {
        /**
         * If the top node already exists and there's still a post
         * that says it's also the top node, fuck you. 
         */
        console.warn(`Detached head node. Ignoring. byeeeeeeeeeeeeeeeeeeeee`)
        continue;
      } else if (discussion.hasparent && topNode) {
        const appropriateParent = findNodeInTree(topNode, discussion.parentid);
        if (appropriateParent) {
          appropriateParent.children.push(discussion);
          discussions.splice(parseInt(idx), 1);
          break;
        }
      }
    }
  }
  return topNode;
}


export async function getDiscussions(module: Module) {
  const _ = (await store.eLearn.wsFunction('mod_forum_get_forum_discussions', {forumid: module.id})).discussions;
  const discussions: Discussion[] = [];
  const token = (await store.eLearn.getSession()).token

  await Promise.all(_.map(async discussion => {
     const discussionPosts: Discussion[] = ((await store.eLearn.wsFunction('mod_forum_get_discussion_posts', {discussionid: discussion.discussion})).posts);
     discussionPosts.map(discussion => {
       discussion.children = []
       discussion.author.urls.profileimage = transformUrl(discussion.author.urls.profileimage, token);
      });
     discussions.push(await buildDiscussionTree(discussionPosts));
  }));

  return discussions;
}