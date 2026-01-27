// utils/post-finder.ts
import mongoose from 'mongoose';
import Community from '@/models/Community';

export async function findPostById(postId: string) {
  if (!postId) {
    throw new Error('Post ID is required');
  }
  
  const idStr = String(postId).trim();
  
  // Method 1: Try direct findById with string
  let post = await Community.findById(idStr);
  if (post) {
    console.log(`✅ Found post with findById(string): ${idStr}`);
    return post;
  }
  
  // Method 2: Try with ObjectId if valid
  if (mongoose.Types.ObjectId.isValid(idStr)) {
    try {
      const objectId = new mongoose.Types.ObjectId(idStr);
      post = await Community.findById(objectId);
      if (post) {
        console.log(`✅ Found post with findById(ObjectId): ${idStr}`);
        return post;
      }
    } catch (error) {
      console.log(`⚠️ ObjectId conversion failed for: ${idStr}`);
    }
  }
  
  // Method 3: Try findOne with string
  post = await Community.findOne({ _id: idStr });
  if (post) {
    console.log(`✅ Found post with findOne(string): ${idStr}`);
    return post;
  }
  
  // Method 4: Try findOne with ObjectId
  if (mongoose.Types.ObjectId.isValid(idStr)) {
    try {
      const objectId = new mongoose.Types.ObjectId(idStr);
      post = await Community.findOne({ _id: objectId });
      if (post) {
        console.log(`✅ Found post with findOne(ObjectId): ${idStr}`);
        return post;
      }
    } catch (error) {
      // Ignore conversion errors
    }
  }
  
  // Method 5: Get all posts and find manually (last resort)
  const allPosts = await Community.find({}).select('_id title').lean();
  const foundPost = allPosts.find(p => {
    const dbId = p._id.toString();
    return dbId === idStr || 
           dbId === idStr.trim() || 
           dbId.replace(/\s/g, '') === idStr.replace(/\s/g, '');
  });
  
  if (foundPost) {
    console.log(`✅ Found post manually: ${idStr}`);
    return await Community.findById(foundPost._id);
  }
  
  console.log(`❌ Post not found with any method: ${idStr}`);
  console.log(`Total posts in DB: ${allPosts.length}`);
  console.log(`Available IDs: ${allPosts.map(p => p._id.toString())}`);
  
  return null;
}