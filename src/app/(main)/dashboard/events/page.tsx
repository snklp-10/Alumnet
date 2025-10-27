"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EventItem = {
  id: string;
  title: string;
  host: string;
  location?: string;
  eventAt: string;
  description?: string;
  rsvpUrl?: string;
};

const initialEvents: EventItem[] = [
  {
    id: "1",
    title: "Alumni Mixer",
    host: "Alumni Network",
    location: "Campus Hall",
    eventAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    description: "Casual networking for alumni across cohorts.",
    rsvpUrl: "#",
  },
  {
    id: "2",
    title: "Tech Talks: AI Today",
    host: "Nimbus Tech",
    location: "Online",
    eventAt: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    description: "A deep dive into modern AI stacks.",
    rsvpUrl: "#",
  },
  {
    id: "3",
    title: "Career Workshop",
    host: "Career Services",
    location: "Room 204",
    eventAt: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    description: "Resume reviews and interview practice.",
    rsvpUrl: "#",
  },
  {
    id: "4",
    title: "Startup Pitch Night",
    host: "Greenfield",
    location: "Auditorium",
    eventAt: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
    description: "Founders pitch to alumni investors.",
    rsvpUrl: "#",
  },
  {
    id: "5",
    title: "Design Sprint",
    host: "PixelWorks",
    location: "Studio 3",
    eventAt: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(),
    description: "Hands-on design exercises and critiques.",
    rsvpUrl: "#",
  },
  {
    id: "6",
    title: "Data Science Meetup",
    host: "Insight Labs",
    location: "Online",
    eventAt: new Date(Date.now() + 1000 * 60 * 60 * 140).toISOString(),
    description: "Showcase projects and lightning talks.",
    rsvpUrl: "#",
  },
  {
    id: "7",
    title: "Cloud Workshop",
    host: "Cloudline",
    location: "Lab 1",
    eventAt: new Date(Date.now() + 1000 * 60 * 60 * 160).toISOString(),
    description: "Intro to cloud infra and IaC.",
    rsvpUrl: "#",
  },
  {
    id: "8",
    title: "Marketing Roundtable",
    host: "BrandUp",
    location: "Online",
    eventAt: new Date(Date.now() + 1000 * 60 * 60 * 180).toISOString(),
    description: "Discussing growth experiments and case studies.",
    rsvpUrl: "#",
  },
  {
    id: "9",
    title: "Volunteer Day",
    host: "Alumni Network",
    location: "Community Center",
    eventAt: new Date(Date.now() + 1000 * 60 * 60 * 200).toISOString(),
    description: "Give back to the local community.",
    rsvpUrl: "#",
  },
  {
    id: "10",
    title: "QA & Testing Clinic",
    host: "TestWorks",
    location: "Lab QA",
    eventAt: new Date(Date.now() + 1000 * 60 * 60 * 220).toISOString(),
    description: "Test automation workshops and mentoring.",
    rsvpUrl: "#",
  },
  {
    id: "11",
    title: "Full Stack Hacknight",
    host: "Stackify",
    location: "Maker Space",
    eventAt: new Date(Date.now() + 1000 * 60 * 60 * 240).toISOString(),
    description: "Build features in small teams overnight.",
    rsvpUrl: "#",
  },
  {
    id: "12",
    title: "Community Brunch",
    host: "Alumni Network",
    location: "Cafeteria",
    eventAt: new Date(Date.now() + 1000 * 60 * 60 * 260).toISOString(),
    description: "Meet and greet new alumni.",
    rsvpUrl: "#",
  },
];

export default function EventsPage() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    try {
      const s = localStorage.getItem("user");
      if (s) setUser(JSON.parse(s));
    } catch (e) {}
  }, []);
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    host: "",
    location: "",
    eventAt: "",
    description: "",
    rsvpUrl: "",
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.host.toLowerCase().includes(q) ||
        (e.location || "").toLowerCase().includes(q)
    );
  }, [events, query]);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.host.trim()) return;
    const newEvent: EventItem = {
      id: String(Date.now()),
      title: form.title,
      host: form.host,
      location: form.location,
      description: form.description,
      rsvpUrl: form.rsvpUrl || "#",
      eventAt: form.eventAt || new Date().toISOString(),
    };
    setEvents((s) => [newEvent, ...s]);
    setForm({
      title: "",
      host: "",
      location: "",
      eventAt: "",
      description: "",
      rsvpUrl: "",
    });
    setShowForm(false);
  }

  return (
    <div className="min-h-screen py-8 mt-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl font-semibold">Events</h1>
                    <p className="text-sm text-muted-foreground">
                      Upcoming events hosted by alumni and partners.
                    </p>
                  </div>
                  <div className="w-80">
                    <Input
                      placeholder="Search events, hosts or locations"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4 pr-2 border posts-scroll max-h-[calc(100vh-12rem)] overflow-y-auto">
              {filtered.map((ev) => (
                <Card key={ev.id} className="border-0 shadow">
                  <CardContent>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{ev.title}</h3>
                          <span className="text-sm text-muted-foreground">
                            @ {ev.host}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {ev.description}
                        </p>
                        <div className="mt-3 text-xs text-gray-400">
                          {ev.location} •{" "}
                          {new Date(ev.eventAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="ml-4 shrink-0 flex flex-col items-end">
                        <a href={ev.rsvpUrl} target="_blank" rel="noreferrer">
                          <Button variant="default" size="sm">
                            RSVP
                          </Button>
                        </a>
                        <span className="text-xs text-muted-foreground mt-2">
                          {ev.host}
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
                      No events found. Try adjusting your search or create a new
                      event.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">Create Event</h4>
                    <p className="text-xs text-muted-foreground">
                      Share meetups and workshops with the network.
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
                        Only admins can create events
                      </div>
                    )}
                  </div>
                </div>

                {showForm && user?.role === "admin" && (
                  <form onSubmit={handleCreate} className="mt-4 space-y-3">
                    <Input
                      placeholder="Event title"
                      value={form.title}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, title: e.target.value }))
                      }
                    />
                    <Input
                      placeholder="Host"
                      value={form.host}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, host: e.target.value }))
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
                      placeholder="Date & time (ISO)"
                      value={form.eventAt}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, eventAt: e.target.value }))
                      }
                    />
                    <Input
                      placeholder="RSVP URL"
                      value={form.rsvpUrl}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, rsvpUrl: e.target.value }))
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
                      <Button type="submit">Post Event</Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <h4 className="font-semibold">Quick Filters</h4>
                <div className="mt-3 flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start">
                    Online
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Onsite
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Workshops
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
