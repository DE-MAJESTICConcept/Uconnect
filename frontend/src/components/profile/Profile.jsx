import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "../../api/profileService";
import axios from "axios";


/**
 * Final Profile.jsx — social-style profile with file uploads, previews,
 * absolute URL handling for uploads, cache-busting, and themed styling
 * matching the uploaded screenshot (deep purple + gold palette).
 *
 * Paste this file over your existing Profile.jsx.
 */

  // 🔥 Fetch users except the current logged-in one


// derive backend origin from VITE_API_BASE_URL (fallback to localhost:5000)
const BACKEND_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "https://uconnect-backend-2qnn.onrender.com").replace(/\/api\/?$/, "");

// helper to force reload of updated images (cache-busting)
const urlWithCacheBust = (url) => (url ? `${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}` : url);

const FieldRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-3 border-b last:border-b-0">
    <span className="text-sm text-gray-500 w-40 shrink-0">{label}</span>
    <span className="font-medium text-gray-900 break-words">{value || "—"}</span>
  </div>
);

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="h-32 w-full bg-gray-200 rounded-2xl" />
    <div className="-mt-10 ml-6 h-20 w-20 rounded-full bg-gray-200 border-4 border-white" />
    <div className="mt-6 h-6 w-40 bg-gray-200 rounded" />
    <div className="mt-2 h-4 w-64 bg-gray-200 rounded" />
    <div className="mt-6 space-y-2">
      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-4 w-5/6 bg-gray-200 rounded" />
      <div className="h-4 w-4/6 bg-gray-200 rounded" />
    </div>
  </div>
);

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  
  const [suggestions, setSuggestions] = useState([]);

  // Normalize API shape -> flat fields
  const normalize = (data) => ({
    id: data?._id || "",
    name: data?.name || "",
    department: data?.profile?.department || "",
    year: data?.profile?.year ?? "",
    matricNumber: data?.profile?.matricNumber || "",
    bio: data?.profile?.bio || "",
    // Accept either absolute URL or relative path from backend
    avatarUrl: data?.profile?.avatar
      ? data.profile.avatar.startsWith("http")
        ? data.profile.avatar
        : `${BACKEND_ORIGIN}${data.profile.avatar}`
      : "",
    coverUrl: data?.profile?.cover
      ? data.profile.cover.startsWith("http")
        ? data.profile.cover
        : `${BACKEND_ORIGIN}${data.profile.cover}`
      : "",
  });


  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("https://uconnect-backend-2qnn.onrender.com/api/users/discover", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuggestions(data); // assume backend sends an array of users
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);


  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getMyProfile();
        const n = normalize(data);
        setProfile(n);
        setForm(n);
      } catch (e) {
        console.error(e);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const hasChanges = useMemo(() => {
    if (!profile) return false;
    return (
      form.name !== profile.name ||
      form.department !== profile.department ||
      String(form.year || "") !== String(profile.year || "") ||
      form.matricNumber !== profile.matricNumber ||
      form.bio !== profile.bio ||
      avatarFile !== null ||
      coverFile !== null
    );
  }, [form, profile, avatarFile, coverFile]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onCancel = () => {
    setForm(profile);
    setAvatarFile(null);
    setCoverFile(null);
    setEditing(false);
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!hasChanges) return setEditing(false);
    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("department", form.department);
      formData.append("year", form.year);
      formData.append("matricNumber", form.matricNumber);
      formData.append("bio", form.bio);
      if (avatarFile) formData.append("avatar", avatarFile);
      if (coverFile) formData.append("cover", coverFile);

      const updated = await updateMyProfile(formData);
      const n = normalize(updated);
      setProfile(n);
      setForm(n);
      setAvatarFile(null);
      setCoverFile(null);
      setEditing(false);
    } catch (e) {
      console.error(e);
      setError("Could not save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9f9fb]">
        <div className="max-w-3xl mx-auto p-4">
          <Skeleton />
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-[#f9f9fb]">
        <div className="max-w-3xl mx-auto p-4">
          <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9fb] py-8">
      <div className="max-w-3xl mx-auto p-4">
        {/* Top card */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex gap-6 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="h-28 w-28 rounded-full border-4 overflow-hidden flex items-center justify-center" style={{ borderColor: '#c2a233' }}>
              {profile.avatarUrl ? (
                <img src={urlWithCacheBust(profile.avatarUrl)} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-gray-100" />
              )}
            </div>
          </div>

          {/* Name + role */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#2d0a6b]">{profile.name || "Unnamed"}</h1>
            <div className="text-sm text-gray-600 mt-1">{profile.department ? `${profile.department}` : "Student | —"}</div>

            <div className="mt-4 flex items-center gap-3">
              {!editing && (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 rounded-md text-white text-sm font-semibold"
                    style={{ backgroundColor: '#2d0a6b' }}
                  >
                    Edit Profile
                  </button>

                </>
              )}
            </div>
          </div>
        </div>

        {/* Details + Edit form */}
        {!editing && (
          <div className="mt-6 grid grid-cols-1 gap-4">
            <div className="bg-white rounded-2xl shadow p-5">
              <h2 className="text-[#2d0a6b] font-semibold mb-3">About Me</h2>
              <p className="text-gray-700">{profile.bio || "No bio yet."}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow p-5">
                <h3 className="text-[#2d0a6b] font-semibold mb-3">Contact Information</h3>
                <div className="text-sm text-gray-700">
                  <div><strong className="text-gray-600">Matric/Staff:</strong> <span className="font-medium">{profile.matricNumber || '—'}</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-5">
                <h3 className="text-[#2d0a6b] font-semibold mb-3">Details</h3>
                <FieldRow label="Name" value={profile.name} />
                <FieldRow label="Department" value={profile.department} />
                <FieldRow label="Year" value={profile.year} />
                <FieldRow label="Matric/Staff Number" value={profile.matricNumber} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-5">
              <h3 className="text-[#2d0a6b] font-semibold mb-3">Recent Activity</h3>
              <ul className="text-gray-700 space-y-2">
                <li>✅ Joined CampusConnect</li>
                <li>✅ Posted about "Tech Fair 2025"</li>
                <li>✅ Connected with Jane Smith</li>
              </ul>
            </div>
          </div>
        )}

        {editing && (
          <form onSubmit={onSave} className="mt-6 bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-[#2d0a6b] font-semibold">Edit Profile</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e9e6f4]"
                  placeholder="Full Name"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Department</label>
                <input
                  name="department"
                  value={form.department}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e9e6f4]"
                  placeholder="Department"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Year</label>
                <input
                  name="year"
                  type="number"
                  value={form.year}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e9e6f4]"
                  placeholder="Year (for students)"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Matric/Staff Number</label>
                <input
                  name="matricNumber"
                  value={form.matricNumber}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e9e6f4]"
                  placeholder="Matric/Staff Number"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-sm text-gray-600">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#e9e6f4] min-h-[96px]"
                  placeholder="Tell people a bit about yourself"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files[0] || null)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Cover</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files[0] || null)}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !hasChanges}
                className="px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: '#2d0a6b' }}
              >
                {saving ? "Saving…" : hasChanges ? "Save Changes" : "No Changes"}
              </button>
            </div>
          </form>
        )}

        {/* Stats (placeholder like social apps) */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Posts", value: 0 },
            { label: "Followers", value: 0 },
            { label: "Following", value: 0 },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow p-4 text-center">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
     <div className="bg-white rounded-2xl shadow p-4 text-center">
  

        <div className="bg-white rounded-2xl shadow p-5 mt-6">
          <h3 className="text-[#2d0a6b] font-semibold mb-3">Discover People</h3>

          {loading ? (
            <p className="text-sm text-gray-500">Loading suggestions...</p>
          ) : suggestions.length === 0 ? (
            <p className="text-sm text-gray-500">No suggestions available</p>
          ) : (
            <div className="space-y-3">
              {suggestions.map((p) => (
                <div
                  key={p._id}
                  className="flex justify-between items-center border-b last:border-0 pb-2"
                >
                  <div>
                    <div className="font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500">
                      {p.profile?.department || "No department"}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigate(`/profile/${p.id}`);
                      console.log("discover response:", p);
                    }}
                    className="px-3 py-1 text-sm rounded-md"
                    style={{ backgroundColor: "#c2a233", color: "#111827" }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      </div>

  );
}
