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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  // Generate year options from 1980 to current year + 4
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear + 4; year >= 1980; year--) {
      years.push(year);
    }
    return years;
  };

  const yearOptions = generateYearOptions();

  // Initialize formData safely (0 = empty/unset for numeric fields)
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
          if (
            ["graduation_year", "enrollment_year", "current_year"].includes(key)
          ) {
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

  if (!user)
    return <p className="text-center mt-20 text-white">Loading user...</p>; // show loader until user is ready

  // router.refresh();

  return (
    <div className="min-h-screen md:py-12 md:px-4 flex items-center justify-center">
      <div className="w-full md:w-[60%] xl:w-1/3 mx-8">
        <Card className="bg-secondary shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-3xl text-center">
              Hi {user.username}, Complete Your Profile
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
                    className="w-28 h-28 rounded-full object-cover border-4 border-blue-200"
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
                      <Select
                        value={
                          formData.graduation_year
                            ? formData.graduation_year.toString()
                            : undefined
                        }
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            graduation_year: parseInt(value, 10),
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {yearOptions.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                          setFormData({
                            ...formData,
                            job_title: e.target.value,
                          })
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
                      <Select
                        value={
                          formData.enrollment_year
                            ? formData.enrollment_year.toString()
                            : undefined
                        }
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            enrollment_year: parseInt(value, 10),
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {yearOptions.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="current-year">Current Year</Label>
                      <Select
                        value={
                          formData.current_year
                            ? formData.current_year.toString()
                            : undefined
                        }
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            current_year: parseInt(value, 10),
                          })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  variant="secondary"
                  className="flex-1 bg-[#C2F970] text-black hover:text-white"
                  onClick={handleSkip}
                >
                  Skip for now
                </Button>
                <Button
                  type="submit"
                  className="flex-1 text-[#B9F18C]"
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
