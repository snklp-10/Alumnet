"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  company: string;
  location?: string;
  description?: string;
  postedAt: string;
  applyUrl?: string;
};

const initialJobs: Job[] = [
  {
    id: "1",
    title: "Frontend Engineer",
    company: "Acme Labs",
    location: "Remote",
    description: "Build modern React apps and collaborate with designers.",
    postedAt: new Date().toISOString(),
    applyUrl: "#",
  },
  {
    id: "2",
    title: "Data Analyst",
    company: "State University",
    location: "Onsite",
    description: "Work with alumni datasets to extract insights.",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    applyUrl: "#",
  },
  {
    id: "3",
    title: "Backend Developer",
    company: "Nimbus Tech",
    location: "Remote",
    description: "Design and maintain APIs and server systems.",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    applyUrl: "#",
  },
  {
    id: "4",
    title: "Product Manager",
    company: "Greenfield",
    location: "Hybrid",
    description:
      "Lead product initiatives and coordinate cross-functional teams.",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    applyUrl: "#",
  },
  {
    id: "5",
    title: "UX Designer",
    company: "PixelWorks",
    location: "Remote",
    description: "Design user experiences and prototype interfaces.",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(),
    applyUrl: "#",
  },
  {
    id: "6",
    title: "Data Scientist",
    company: "Insight Labs",
    location: "Onsite",
    description: "Build models and drive analytics for product teams.",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    applyUrl: "#",
  },
  {
    id: "7",
    title: "DevOps Engineer",
    company: "Cloudline",
    location: "Remote",
    description: "Maintain CI/CD pipelines and cloud infrastructure.",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    applyUrl: "#",
  },
  {
    id: "8",
    title: "Marketing Lead",
    company: "BrandUp",
    location: "Hybrid",
    description: "Drive growth and marketing campaigns for new products.",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 140).toISOString(),
    applyUrl: "#",
  },
  {
    id: "9",
    title: "QA Engineer",
    company: "TestWorks",
    location: "Onsite",
    description: "Create automated tests and ensure product quality.",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 160).toISOString(),
    applyUrl: "#",
  },
  {
    id: "10",
    title: "Systems Analyst",
    company: "Enterprise Co.",
    location: "Remote",
    description: "Analyze business systems and recommend improvements.",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString(),
    applyUrl: "#",
  },
  {
    id: "11",
    title: "Full Stack Engineer",
    company: "Stackify",
    location: "Remote",
    description: "Work across frontend and backend to deliver features.",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 220).toISOString(),
    applyUrl: "#",
  },
  {
    id: "12",
    title: "Community Manager",
    company: "Alumni Network",
    location: "Hybrid",
    description: "Engage alumni and curate events.",
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(),
    applyUrl: "#",
  },
];

export default function JobsPage() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    try {
      const s = localStorage.getItem("user");
      if (s) setUser(JSON.parse(s));
    } catch (e) {}
  }, []);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    applyUrl: "",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        (j.location || "").toLowerCase().includes(q)
    );
  }, [jobs, query]);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.company.trim()) return;
    const newJob: Job = {
      id: String(Date.now()),
      title: form.title,
      company: form.company,
      location: form.location,
      description: form.description,
      applyUrl: form.applyUrl || "#",
      postedAt: new Date().toISOString(),
    };
    setJobs((s) => [newJob, ...s]);
    setForm({
      title: "",
      company: "",
      location: "",
      description: "",
      applyUrl: "",
    });
    setShowForm(false);
  }

  return (
    <div className="min-h-screen py-8 mt-14">
      <div className="flex w-full min-h-1/2 absolute bottom-0 bg-linear-to-t from-primary/20 px-0 left-0" />
      <div className="max-w-7xl mx-auto px-4 z-50">
        <div className="grid lg:grid-cols-3 gap-6 z-50">
          <div className="lg:col-span-2 space-y-6 z-50">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-semibold">
                      Job Opportunities
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Browse and apply to roles posted by alumni and partners.
                    </p>
                  </div>
                  <div className="w-80">
                    <Input
                      placeholder="Search jobs, companies or locations"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4 pr-2 posts-scroll max-h-[calc(100vh-16rem)] overflow-y-auto z-50">
              {filtered.map((job) => (
                <Card key={job.id} className="border-0 shadow">
                  <CardContent>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <span className="text-sm text-muted-foreground">
                            @ {job.company}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {job.description}
                        </p>
                        <div className="mt-3 text-xs text-gray-400">
                          {job.location} • Posted{" "}
                          {new Date(job.postedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="ml-4 shrink-0 flex flex-col items-end">
                        <a href={job.applyUrl} target="_blank" rel="noreferrer">
                          <Button variant="default" size="sm">
                            Apply
                          </Button>
                        </a>
                        <span className="text-xs text-muted-foreground mt-2">
                          {job.company}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filtered.length === 0 && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No jobs found. Try adjusting your search or create a job
                      posting.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <aside className="space-y-6 z-50">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-4 gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Post a Job</h4>
                    <p className="text-xs text-muted-foreground">
                      Share opportunities with the network.
                    </p>
                  </div>
                  <div>
                    {user?.role === "admin" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowForm((s) => !s)}
                      >
                        {showForm ? "Close" : "Create"}
                      </Button>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        Only admins can post jobs
                      </div>
                    )}
                  </div>
                </div>

                {showForm && user?.role === "admin" && (
                  <form onSubmit={handleCreate} className="mt-4 space-y-3">
                    <Input
                      placeholder="Job title"
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                    />
                    <Input
                      placeholder="Company"
                      value={form.company}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, company: e.target.value }))
                      }
                    />
                    <Input
                      placeholder="Location"
                      value={form.location}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, location: e.target.value }))
                      }
                    />
                    <Input
                      placeholder="Apply URL"
                      value={form.applyUrl}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, applyUrl: e.target.value }))
                      }
                    />
                    <Textarea
                      placeholder="Short description"
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                    />
                    <div className="flex justify-end">
                      <Button type="submit">Post Job</Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* <Card className="border-0 shadow-lg">
              <CardContent className="pt-4">
                <h4 className="font-semibold">Quick Filters</h4>
                <div className="mt-3 flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start">
                    Remote
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Full-time
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Part-time
                  </Button>
                </div>
              </CardContent>
            </Card> */}
          </aside>
        </div>
      </div>
    </div>
  );
}
