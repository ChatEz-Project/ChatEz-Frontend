import { User } from '../../../../backend/types';

export const searchedFriends = (
  searchValue: string,
  friendsList: User[]
): User[] => {
  // If search value is empty, return all friends
  if (!searchValue.trim()) {
    return friendsList;
  }

  // Convert search value to lowercase for case-insensitive matching
  const searchTerm = searchValue.toLowerCase().trim();

  return friendsList.filter((friend) =>
    friend.displayName.toLowerCase().includes(searchTerm)
  );
};
