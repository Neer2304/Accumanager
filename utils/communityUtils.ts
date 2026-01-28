// utils/communityUtils.ts
export const getCommunityProfile = async (userId: string) => {
  try {
    const response = await fetch(`/api/community/profile/${userId}`, {
      credentials: 'include'
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching community profile:', error);
    return null;
  }
};

export const followUser = async (userId: string) => {
  const response = await fetch(`/api/community/profile/${userId}/follow`, {
    method: 'POST',
    credentials: 'include'
  });
  
  return response.json();
};

export const unfollowUser = async (userId: string) => {
  const response = await fetch(`/api/community/profile/${userId}/follow`, {
    method: 'DELETE',
    credentials: 'include'
  });
  
  return response.json();
};