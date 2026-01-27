import { Types } from 'mongoose';
import Community from '@/models/Community';
import User from '@/models/User';

export interface AddCommentParams {
  postId: string | Types.ObjectId;
  userId: string | Types.ObjectId;
  content: string;
  userRole?: string;
}

export async function addCommentToPost({
  postId,
  userId,
  content,
  userRole = 'user'
}: AddCommentParams) {
  // Get user details
  const user = await User.findById(userId).select('name avatar role');
  if (!user) {
    throw new Error('User not found');
  }

  // Find post
  const post = await Community.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  // Create comment
  const comment = {
    user: new Types.ObjectId(userId),
    userName: user.name,
    userAvatar: user.avatar || null,
    userRole: user.role || userRole,
    content: content.trim(),
    likes: [],
    likeCount: 0,
    replies: [],
    isSolution: false,
    createdAt: new Date()
  };

  // Add comment
  (post as any).comments.push(comment);
  post.commentCount = (post as any).comments.length;
  post.lastActivityAt = new Date();

  await post.save();

  // Return the populated comment
  const updatedPost = await Community.findById(postId)
    .populate('comments.user', 'name avatar role')
    .lean();

  if (!updatedPost) {
    throw new Error('Failed to retrieve updated post');
  }

  const comments = updatedPost.comments || [];
  return comments[comments.length - 1];
}