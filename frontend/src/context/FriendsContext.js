// src/context/FriendsContext.js
import { createContext, useContext } from "react";

const FriendsContext = createContext(null);

export function useFriends() {
  const ctx = useContext(FriendsContext);
  if (!ctx) throw new Error("useFriends must be used inside FriendsProvider");
  return ctx;
}

export default FriendsContext;
