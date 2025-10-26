"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { IUser } from "@/models/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UserSetup: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // get userId from query

  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize formData safely
  const [formData, setFormData] = useState({
    bio: "",
    profileImage: "",
    graduation_year: 0,
    degree: "",
    current_company: "",
    job_title: "",
    enrollment_year: 0,
    current_year: 0,
    major: "",
  });

  // Fetch user info when component mounts
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`, { method: "GET" });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to fetch user");
          return;
        }

        setUser(data.user);

        // Redirect if user already has bio/profileImage
        if (data.user.bio && data.user.profileImage) {
          router.push("/dashboard");
        }
      } catch (err) {
        toast.error("Unexpected error fetching user");
      }
    };

    fetchUser();
  }, [userId, router]);

  // Populate form when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || "",
        profileImage: user.profileImage || "",
        graduation_year: user.graduation_year || 0,
        degree: user.degree || "",
        current_company: user.current_company || "",
        job_title: user.job_title || "",
        enrollment_year: user.enrollment_year || 0,
        current_year: user.current_year || 0,
        major: user.major || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const dataToSend: Record<string, any> = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "") {
          if (["graduation_year", "enrollment_year", "current_year"].includes(key)) {
            dataToSend[key] = parseInt(value as string, 10);
          } else {
            dataToSend[key] = value;
          }
        }
      });

      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to update profile");
        return;
      }

      setUser(result.user);
      toast.success("Profile setup completed!");
      router.push("/dashboard");
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, profileImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  if (!user) return <p className="text-center mt-20">Loading...</p>; // show loader until user is ready

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Complete Your Profile
            </CardTitle>
            <CardDescription className="text-center">
              Tell us more about yourself to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center space-y-4">
                {formData.profileImage && (
                  <img
                    src={formData.profileImage}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                  />
                )}
                <div className="w-full">
                  <Label htmlFor="profile-image">Profile Picture</Label>
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={3}
                />
              </div>

              {/* Alumni fields */}
              {user.role === "alumni" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="graduation-year">Graduation Year</Label>
                      <Input
                        id="graduation-year"
                        type="number"
                        placeholder="2020"
                        value={formData.graduation_year}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            graduation_year: e.target.valueAsNumber,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="degree">Degree</Label>
                      <Input
                        id="degree"
                        type="text"
                        placeholder="B.Tech Computer Science"
                        value={formData.degree}
                        onChange={(e) =>
                          setFormData({ ...formData, degree: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="current-company">Current Company</Label>
                      <Input
                        id="current-company"
                        type="text"
                        placeholder="Tech Corp"
                        value={formData.current_company}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            current_company: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="job-title">Job Title</Label>
                      <Input
                        id="job-title"
                        type="text"
                        placeholder="Software Engineer"
                        value={formData.job_title}
                        onChange={(e) =>
                          setFormData({ ...formData, job_title: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Student fields */}
              {user.role === "student" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="enrollment-year">Enrollment Year</Label>
                      <Input
                        id="enrollment-year"
                        type="number"
                        placeholder="2022"
                        value={formData.enrollment_year}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            enrollment_year: e.target.valueAsNumber,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="current-year">Current Year</Label>
                      <Input
                        id="current-year"
                        type="number"
                        placeholder="2"
                        value={formData.current_year}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            current_year: e.target.valueAsNumber,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="major">Major</Label>
                    <Input
                      id="major"
                      type="text"
                      placeholder="Computer Science"
                      value={formData.major}
                      onChange={(e) =>
                        setFormData({ ...formData, major: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {/* Admin minimal setup */}
              {user.role === "admin" && (
                <p className="text-sm text-gray-600 text-center">
                  As an admin, you can skip to the dashboard or add a bio and
                  profile picture.
                </p>
              )}

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleSkip}
                >
                  Skip for now
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Complete Setup"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserSetup;
