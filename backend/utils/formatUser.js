// utils/formatUser.js
export const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  bio: user.profile?.bio || "",
  department: user.profile?.department || "",
  year: user.profile?.year || null,
  matricNumber: user.profile?.matricNumber || "",
  staffId: user.profile?.staffId || "",
  avatarUrl: user.profile?.avatar || null,
  coverUrl: user.profile?.cover || null,
  friends: user.friends || [],
  friendRequests: user.friendRequests || [],
});
