// src/components/profile/MutualFriends.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profileService from "../../api/profileService";

const AvatarSmall = ({ src, name }) => (
  src ? (
    <img src={src} alt={name} className="w-10 h-10 rounded-full object-cover" loading="lazy" />
  ) : (
    <div className="w-10 h-10 rounded-full bg-[rgb(41,22,112)] text-white flex items-center justify-center font-semibold">
      {(name || "U").charAt(0).toUpperCase()}
    </div>
  )
);

export default function MutualFriends({ targetId, max = 3 }) {
  const [mutuals, setMutuals] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!targetId) return;
      setLoading(true);
      try {
        const res = await profileService.getMutualFriends(targetId);
        if (!mounted) return;
        setMutuals(res.mutuals || []);
        setCount(res.count || 0);
      } catch (err) {
        console.error("Failed to load mutual friends", err);
        if (mounted) {
          setMutuals([]);
          setCount(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [targetId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="h-12 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  if (!mutuals || mutuals.length === 0) {
    if (count === 0) return null; // nothing to show
    // if count > 0 but mutuals not provided (shouldn't happen) show a note
    return (
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="text-sm text-gray-500">Mutual friends</div>
        <div className="text-sm mt-2">You have {count} mutual friend{count > 1 ? "s" : ""}.</div>
      </div>
    );
  }

  const displayed = mutuals.slice(0, max);

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-gray-800">Mutual friends</div>
        <div className="text-xs text-gray-500">{count} total</div>
      </div>

      <div className="flex items-center gap-3">
        {displayed.map((u) => (
          <Link key={u._id || u.id} to={`/profile/${u._id || u.id}`} className="flex items-center gap-3">
            <AvatarSmall src={u.profile?.avatar} name={u.name} />
            <div className="text-sm text-gray-800">{u.name}</div>
          </Link>
        ))}

        {count > displayed.length && (
          <div className="ml-2 text-sm text-gray-500">+{count - displayed.length} more</div>
        )}
      </div>
    </div>
  );
}
