// src/context/useFriends.js
import { useContext } from "react";
import FriendsContext from "./FriendsContext";

export function useFriends() {
  const ctx = useContext(FriendsContext);
  if (!ctx) {
    throw new Error("useFriends must be used inside FriendsProvider");
  }
  return ctx;
}
