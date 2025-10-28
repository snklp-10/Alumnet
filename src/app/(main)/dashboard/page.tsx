"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, UserPlus, Briefcase, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Post = {
  id: string;
  author: string;
  content: string;
  createdAt?: string;
};

type SuggestedUser = {
  id: string;
  username: string;
  role?: string;
  profileImage?: string;
};

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const storage = localStorage.getItem("user");
    if (storage) setUser(JSON.parse(storage));

    fetchFeed();
    fetchSuggestedUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/feed");
      if (!res.ok) throw new Error("no feed api");
      const data = await res.json();
      const mapped = (data || []).map((p: any) => ({
        id: p.id,
        author: p.author || p.authorName || "Unknown",
        content: p.content,
        createdAt: p.createdAt,
      }));
      setPosts(mapped);
    } catch (err) {
      setPosts([
        { id: "1", author: "Alumni Alice", content: "Welcome to Alumnet!" },
        {
          id: "2",
          author: "Student Sam",
          content: "Excited to connect with everyone.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const exclude = user?.id || user?._id || "";
      const res = await fetch(`/api/users?exclude=${exclude}&limit=6`);
      if (!res.ok) throw new Error("no users api");
      const users = await res.json();
      const filtered = users.filter(
        (u: any) => String(u.id) !== String(exclude)
      );
      setSuggestedUsers(filtered.slice(0, 5));
    } catch (err) {
      setSuggestedUsers([
        { id: "u1", username: "Jane Doe", role: "alumni" },
        { id: "u2", username: "John Smith", role: "student" },
        { id: "u3", username: "Priya Patel", role: "alumni" },
      ]);
    }
  };

  const searchUsers = async (query: string) => {
    try {
      const q = query.trim().toLowerCase();
      if (!q) {
        fetchSuggestedUsers();
        return;
      }

      setSearching(true);
      const res = await fetch(
        `/api/users?search=${encodeURIComponent(query)}&limit=10`
      );
      if (!res.ok) throw new Error("no users api");
      const users = await res.json();

      // 🔥 Filter client-side for matches only
      const filtered = (users || [])
        .filter(
          (u: any) =>
            String(u.id) !== String(user?.id || user?._id || "") && // exclude self
            (u.username?.toLowerCase().includes(q) || // match by username
              u.name?.toLowerCase().includes(q)) // or by name if present
        )
        .slice(0, 10);

      setSuggestedUsers(filtered);
    } catch (err) {
      toast.error("Failed to search users");
    } finally {
      setSearching(false);
    }
  };

  // ✅ Simplified clear search — automatically triggers default fetch via effect
  const clearSearch = () => {
    setUserSearch("");
  };

  // ✅ Fixed live debounce + restore suggestions logic
  useEffect(() => {
    const q = userSearch.trim();

    if (!q) {
      const timer = setTimeout(() => {
        fetchSuggestedUsers();
      }, 250);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      searchUsers(q);
    }, 300);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSearch]);

  const handlePostCreated = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const payload = {
        content: newPost.trim(),
        authorId: user?.id || user?._id || null,
        authorName: user?.username || user?.name || null,
      } as any;

      const res = await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create post");
        return;
      }

      const created: Post = {
        id: data.id,
        author: data.authorName,
        content: data.content,
        createdAt: data.createdAt,
      };

      setPosts((p) => [created, ...p]);
      setNewPost("");
      toast.success("Post created");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred creating post");
    }
  };

  const handleFollow = async (id: string) => {
    const followerId = user?.id || user?._id || null;
    const target = suggestedUsers.find((u) => u.id === id) as
      | SuggestedUser
      | undefined;
    try {
      const res = await fetch(`/api/users/${id}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Failed to follow");
        return;
      }

      if (data.action === "followed") {
        setSuggestedUsers((s) => s.filter((u) => u.id !== id));

        const followedName = data?.user?.username || target?.username || "User";

        toast.success(`${followedName} followed`, {
          action: {
            label: "Undo",
            onClick: async () => {
              try {
                const undoRes = await fetch(`/api/users/${id}/follow`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ followerId }),
                });
                const undoData = await undoRes.json();
                if (!undoRes.ok) {
                  toast.error(undoData?.error || "Failed to undo follow");
                  return;
                }
                if (target) {
                  setSuggestedUsers((s) => [target, ...s]);
                }
                toast.success(
                  undoData.action === "unfollowed" ? "Unfollowed" : "Updated"
                );
              } catch (e) {
                toast.error("Failed to undo follow");
              }
            },
          },
        });
      } else {
        toast.success("User unfollowed");
      }
    } catch (err) {
      toast.error("User follow failed");
    }
  };

  return (
    <div className="min-h-screen bg-[rgb(11,11,15)] text-gray-200 py-24 px-4 transition-colors duration-300">
      <div className="flex w-full min-h-1/2 absolute bottom-0 bg-linear-to-t from-primary/20 px-0 left-0" />
      <div className="max-w-7xl mx-auto px-4 z-50">
        <div className="grid lg:grid-cols-3 gap-6 z-50">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-linear-to-r from-primary to-background border-r-primary border-l-0 border-y-0">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {user?.username || "Friend"}!
                </h2>
                <p className="text-gray-400">
                  {user?.role === "student" &&
                    "Connect with alumni and discover opportunities."}
                  {user?.role === "alumni" &&
                    "Share your experiences and help students grow."}
                  {user?.role === "admin" &&
                    "Manage the community and keep everything running smoothly."}
                </p>
              </CardContent>
            </Card>

            {/* Create Post */}
            <Card className="border border-white/10 bg-[#1a1a1e] shadow-lg hover:border-blue-600/40 transition">
              <CardContent>
                <form onSubmit={handlePostCreated} className="space-y-3">
                  <textarea
                    className="w-full rounded-md p-3 border "
                    rows={3}
                    placeholder="Share something with your network..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Post
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            {loading ? (
              <div
                className="flex justify-center py-12 overflow-y-auto"
                data-testid="loading-spinner"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : posts.length === 0 ? (
              <Card className="border border-white/10 bg-[#1a1a1e] shadow-lg hover:border-blue-600/40 transition">
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400 mb-4">
                    No posts yet. Start by following some users or create your
                    first post!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="relative">
                <div
                  className="posts-scroll space-y-6 max-h-[50vh] overflow-y-auto pr-2 pb-10"
                  data-testid="posts-feed"
                >
                  {posts.map((post) => (
                    <Card key={post.id} className="border-0 shadow">
                      <CardContent>
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ring-white ring-1">
                            {(post.author?.charAt(0) ?? "?").toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold">
                                  {post.author || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {post.createdAt
                                    ? new Date(post.createdAt).toLocaleString()
                                    : "Just now"}
                                </p>
                              </div>
                            </div>
                            <p className="mt-3 text-gray-300">{post.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 z-50">
            {/* Suggested Users */}
            <Card
              className="border-0 shadow-lg"
              data-testid="suggested-users-card"
            >
              <CardContent>
                <div className="flex flex-col items-center justify-center mb-4 gap-4">
                  <div className="flex items-center justify-between w-full ">
                    <h3 className="font-semibold text-lg text-start">
                      People to Follow
                    </h3>
                    <UserPlus className="w-5 h-5 text-gray-400" />
                  </div>
                  <Separator />
                  <div className="w-full mt-3">
                    <div className="flex items-center gap-2">
                      <input
                        className="flex-1 rounded-md p-2 bg-[#0b0b0f] border border-white/10 text-sm"
                        placeholder="Search users"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        aria-label="Search users"
                      />
                      <Button
                        type="button"
                        onClick={clearSearch}
                        variant="outline"
                        aria-label="Clear search"
                        className="p-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {searching && (
                  <p className="text-xs text-gray-500 text-center py-2">
                    Searching...
                  </p>
                )}

                {suggestedUsers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No suggestions available
                  </p>
                ) : (
                  <div className="space-y-3">
                    {suggestedUsers.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-center justify-between"
                      >
                        <Link
                          href={`/profile/${s.id}`}
                          className="flex items-center space-x-3 flex-1"
                        >
                          {s.profileImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={s.profileImage}
                              alt={s.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ring-white ring-1">
                              {s.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {s.username}
                            </p>
                            <p className="text-xs text-gray-500 capitalize">
                              {s.role}
                            </p>
                          </div>
                        </Link>
                        <Button
                          size="sm"
                          onClick={() => handleFollow(s.id)}
                          className="text-xs bg-background ring-primary ring-1"
                        >
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border border-white/10 bg-[#1a1a1e] shadow-lg hover:border-blue-600/40 transition z-100">
              <CardContent>
                <h3 className="font-semibold text-lg mb-4 ">Quick Links</h3>
                <Separator />
                <div className="mt-5 space-y-5">
                  <Link href="dashboard/jobs/">
                    <Button variant="ghost" className="w-full justify-start">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Job Opportunities
                    </Button>
                  </Link>
                  <Link href="dashboard/events/">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Upcoming Events
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
