// src/SocketToastsBootstrap.jsx
import React, { useEffect } from "react";
import { getSocket, initSocket } from "./socket";
import { useToast } from "./context/ToastContext";

export default function SocketToastsBootstrap() {
  const { show } = useToast();

  useEffect(() => {
    const socket = initSocket();
    if (!socket) return;

    const onRequest = (payload) => {
      const req = payload?.request;
      const from = req?.from || payload?.from;
      const name = from?.name || "Someone";
      show({
        title: "Friend request",
        message: `${name} sent you a friend request.`,
        type: "info",
        timeout: 6000,
      });
    };

    const onAccepted = (payload) => {
      const byId = payload?.by;
      // If server sends by name include it; otherwise show generic
      const name = payload?.byName || payload?.by?.name || "Someone";
      show({
        title: "Friend accepted",
        message: `${name} accepted your friend request.`,
        type: "success",
        timeout: 6000,
      });
    };

    const onRejected = (payload) => {
      const name = payload?.byName || payload?.by?.name || "Someone";
      show({
        title: "Friend request rejected",
        message: `${name} rejected the friend request.`,
        type: "warning",
        timeout: 6000,
      });
    };

    const onMessageNew = (payload) => {
      const msg = payload?.message;
      const sender = (msg?.sender && (typeof msg.sender === "object" ? msg.sender.name : msg.sender)) || "Someone";
      show({
        title: "New message",
        message: `${sender}: ${msg?.content?.slice(0, 120) || "Sent an attachment"}`,
        type: "info",
        timeout: 6000,
      });
    };

    socket.on("friend:request:received", onRequest);
    socket.on("friend:accepted", onAccepted);
    socket.on("friend:rejected", onRejected);
    socket.on("message:new", onMessageNew);

    return () => {
      socket.off("friend:request:received", onRequest);
      socket.off("friend:accepted", onAccepted);
      socket.off("friend:rejected", onRejected);
      socket.off("message:new", onMessageNew);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
