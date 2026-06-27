"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Image as ImageIcon,
  Mail,
  Film,
  Heart,
  Plus,
  Trash2,
  Edit2,
  LogOut,
  Sparkles,
  Lock,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"timeline" | "memories" | "messages" | "videos" | "reasons">("timeline");

  // Data States
  const [timelineItems, setTimelineItems] = useState<any[]>([]);
  const [memoriesItems, setMemoriesItems] = useState<any[]>([]);
  const [messagesItems, setMessagesItems] = useState<any[]>([]);
  const [videosItems, setVideosItems] = useState<any[]>([]);
  const [reasonsItems, setReasonsItems] = useState<any[]>([]);
  
  // Loading states
  const [dataLoading, setDataLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [seedSuccess, setSeedSuccess] = useState(false);

  // Form States (for Create & Edit)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTimeline, setFormTimeline] = useState({ title: "", date: "", description: "", image: "", order: 0 });
  const [formMemory, setFormMemory] = useState({ image: "", caption: "", date: "", category: "Trips" });
  const [formMessage, setFormMessage] = useState({ title: "", content: "", order: 0 });
  const [formVideo, setFormVideo] = useState({ title: "", videoUrl: "", description: "" });
  const [formReason, setFormReason] = useState({ title: "", description: "", icon: "Heart", order: 0 });

  // 1. Check authentication status
  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated);
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  // 2. Fetch data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [tRes, mRes, msgRes, vRes, rRes] = await Promise.all([
        fetch("/api/timeline"),
        fetch("/api/memories"),
        fetch("/api/messages"),
        fetch("/api/videos"),
        fetch("/api/reasons"),
      ]);

      const [tData, mData, msgData, vData, rData] = await Promise.all([
        tRes.json(),
        mRes.json(),
        msgRes.json(),
        vRes.json(),
        rRes.json(),
      ]);

      setTimelineItems(Array.isArray(tData) ? tData : []);
      setMemoriesItems(Array.isArray(mData) ? mData : []);
      setMessagesItems(Array.isArray(msgData) ? msgData : []);
      setVideosItems(Array.isArray(vData) ? vData : []);
      setReasonsItems(Array.isArray(rData) ? rData : []);
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || "Login failed");
      }
    } catch {
      setLoginError("Failed to connect to authentication server.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    setIsAuthenticated(false);
  };

  // 3. CRUD handlers
  const handleCreateOrUpdate = async (e: React.FormEvent, endpoint: string, formPayload: any) => {
    e.preventDefault();
    setActionLoading("submitting");
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/${endpoint}?id=${editingId}` : `/api/${endpoint}`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formPayload),
      });

      if (res.ok) {
        setEditingId(null);
        resetForms();
        fetchData();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch {
      alert("Failed to submit form.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (endpoint: string, id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/${endpoint}?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete item.");
      }
    } catch {
      alert("Error deleting item.");
    } finally {
      setActionLoading(null);
    }
  };

  const startEdit = (item: any, type: typeof activeTab) => {
    setEditingId(item._id);
    if (type === "timeline") {
      setFormTimeline({
        title: item.title,
        date: item.date,
        description: item.description,
        image: item.image,
        order: item.order,
      });
    } else if (type === "memories") {
      setFormMemory({
        image: item.image,
        caption: item.caption,
        date: item.date,
        category: item.category,
      });
    } else if (type === "messages") {
      setFormMessage({
        title: item.title,
        content: item.content,
        order: item.order,
      });
    } else if (type === "videos") {
      setFormVideo({
        title: item.title,
        videoUrl: item.videoUrl,
        description: item.description,
      });
    } else if (type === "reasons") {
      setFormReason({
        title: item.title,
        description: item.description,
        icon: item.icon,
        order: item.order,
      });
    }
  };

  const resetForms = () => {
    setEditingId(null);
    setFormTimeline({ title: "", date: "", description: "", image: "", order: 0 });
    setFormMemory({ image: "", caption: "", date: "", category: "Trips" });
    setFormMessage({ title: "", content: "", order: 0 });
    setFormVideo({ title: "", videoUrl: "", description: "" });
    setFormReason({ title: "", description: "", icon: "Heart", order: 0 });
  };

  // Seeding default mock data
  const handleSeedData = async () => {
    if (!confirm("This will load high-quality romantic placeholders into your database. Proceed?")) return;
    setActionLoading("seeding");
    try {
      // Seed Timeline
      const tSeed = [
        { title: "The Day We Met", date: "June 14, 2024", description: "Our eyes locked and the universe clicked. I knew from that very first hello that my life had changed forever.", image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800", order: 1 },
        { title: "First Magical Date", date: "July 2, 2024", description: "Sharing laughs over warm coffee, walking in the light rain under one umbrella. I was absolutely mesmerized.", image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800", order: 2 },
        { title: "Making It Official", date: "August 15, 2024", description: "Under a blanket of shining stars, I finally asked you to be mine. You said yes, and I became the luckiest guy alive.", image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800", order: 3 },
      ];
      // Seed Memories
      const mSeed = [
        { image: "https://images.unsplash.com/photo-1507504038482-7621c97a0674?auto=format&fit=crop&q=80&w=800", caption: "Watching the sun dissolve into the sea, holding your hand.", date: "2024-09", category: "Trips" },
        { image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&q=80&w=800", caption: "That fancy date night where you looked like an absolute movie star.", date: "2024-11", category: "Dates" },
        { image: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80&w=800", caption: "Eating ice cream in the middle of a winter freeze. We are goofy together!", date: "2025-01", category: "Goofy" },
      ];
      // Seed Love Letters
      const msgSeed = [
        { title: "To My Soulmate ❤️", content: "Hey Beautiful,\n\nWriting this to remind you how much you mean to me. In a world full of noise, your smile is my quiet harbor. Thank you for being my lover, my best friend, and my favorite adventure.\n\nI love you to the moon and back.", order: 1 },
        { title: "On Dark Days ⛅", content: "My Sweetheart,\n\nWhenever you feel low or doubt yourself, read this. You are stronger than you think, kinder than you know, and more loved than you could ever comprehend. I am always in your corner, holding your hand.", order: 2 },
        { title: "My Promise To You 💍", content: "My Love,\n\nI promise to celebrate your wins, comfort your tears, cook you dinner, and love you more with every single heartbeat. You have my whole heart for my whole life.\n\nYours always.", order: 3 },
      ];
      // Seed Videos
      const vSeed = [
        { title: "Our Roadtrip Joyride", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", description: "Singing out loud on the open highway, hair blowing in the wind." },
        { title: "Sweet Winter Walk", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", description: "Stepping through frozen trails, keeping warm by holding hands inside my coat pocket." },
      ];
      // Seed Reasons
      const rSeed = [
        { title: "Your Kindness", description: "The gentle way you look after others, your warm heart, and the empathy you share makes me strive to be a better man.", icon: "Heart", order: 1 },
        { title: "Your Gorgeous Smile", description: "It completely lights up the darkest rooms, cures my bad days instantly, and makes my heart skip a beat every time.", icon: "Smile", order: 2 },
        { title: "Your Cute Laugh", description: "That musical giggle that escapes you when you are genuinely happy. It is my favorite soundtrack in the entire world.", icon: "Music", order: 3 },
      ];

      // Submit all seed data sequentially
      const submitSeed = async (endpoint: string, dataArray: any[]) => {
        // Clear existing database first
        const getRes = await fetch(`/api/${endpoint}`);
        const items = await getRes.json();
        if (Array.isArray(items)) {
          for (const item of items) {
            await fetch(`/api/${endpoint}?id=${item._id}`, { method: "DELETE" });
          }
        }

        // Add new items
        for (const data of dataArray) {
          await fetch(`/api/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
        }
      };

      await Promise.all([
        submitSeed("timeline", tSeed),
        submitSeed("memories", mSeed),
        submitSeed("messages", msgSeed),
        submitSeed("videos", vSeed),
        submitSeed("reasons", rSeed),
      ]);

      setSeedSuccess(true);
      fetchData();
      setTimeout(() => setSeedSuccess(false), 3000);
    } catch {
      alert("Failed to seed database.");
    } finally {
      setActionLoading(null);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-obsidian flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  // 4. Render Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#180822] to-[#0a050b] flex items-center justify-center p-6 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/10 rounded-full blur-[80px]" />
        
        <div className="w-full max-w-md glass-panel rounded-2xl p-8 border border-pink-500/10 relative z-10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="p-4 bg-pink-950/40 rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-pink-500/20 text-rose-400 mb-4">
              <Lock className="w-8 h-8 filter drop-shadow-[0_0_5px_rgba(244,114,182,0.5)]" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-pink-100">Admin Sanctuary</h1>
            <p className="text-sm text-pink-200/50 mt-2 font-light">Enter credentials to unlock control systems</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-pink-300 font-medium mb-2">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-pink-950/20 border border-pink-500/15 rounded-xl px-4 py-3 text-pink-100 placeholder-pink-300/25 focus:outline-none focus:border-rose-500 transition-colors"
                placeholder="admin@love.com"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-pink-300 font-medium mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-pink-950/20 border border-pink-500/15 rounded-xl px-4 py-3 text-pink-100 placeholder-pink-300/25 focus:outline-none focus:border-rose-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-sm bg-red-950/20 border border-red-500/20 rounded-xl py-2 px-3 text-center">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white font-serif font-semibold py-3.5 rounded-xl cursor-pointer shadow-lg shadow-rose-950/30 flex items-center justify-center gap-2"
            >
              {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Unlock Heart Console"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 5. Render Admin Console (Authenticated)
  return (
    <div className="min-h-screen bg-obsidian text-pink-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-pink-950/15 border-b md:border-b-0 md:border-r border-pink-500/10 p-6 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span className="font-serif font-bold text-lg tracking-wide text-glow-rose">Love Control</span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-2">
            {[
              { id: "timeline", label: "Timeline", icon: Calendar },
              { id: "memories", label: "Memories", icon: ImageIcon },
              { id: "messages", label: "Love Letters", icon: Mail },
              { id: "videos", label: "Videos", icon: Film },
              { id: "reasons", label: "Reasons", icon: Heart },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    resetForms();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-rose-600 text-white shadow-lg shadow-rose-950/50"
                      : "text-pink-300/60 hover:text-pink-200 hover:bg-pink-950/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-8 pt-6 border-t border-pink-500/10 space-y-4">
          {/* Seed Data Button */}
          <button
            onClick={handleSeedData}
            disabled={actionLoading === "seeding"}
            className="w-full flex items-center justify-center gap-2 bg-pink-950/30 hover:bg-pink-950/60 border border-pink-500/15 text-pink-200 text-xs py-2.5 rounded-xl transition-all cursor-pointer font-medium"
          >
            {actionLoading === "seeding" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : seedSuccess ? (
              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            )}
            {seedSuccess ? "DB Seeded!" : "Seed Demo Data"}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-950/20 hover:bg-red-950/40 border border-red-500/10 text-red-300 text-xs py-2.5 rounded-xl transition-all cursor-pointer font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out Console
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 max-w-5xl overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-500/10 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-pink-100 capitalize">
              Manage {activeTab}
            </h1>
            <p className="text-sm text-pink-200/50 font-light mt-1">
              Add, update, or clear relationship elements displayed on the landing experience.
            </p>
          </div>
        </header>

        {dataLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-5">
              <div className="glass-panel border border-pink-500/10 rounded-2xl p-6 shadow-2xl relative">
                <h2 className="text-xl font-serif font-bold text-pink-100 flex items-center gap-2 mb-6">
                  <Plus className="w-5 h-5 text-rose-400" />
                  {editingId ? "Edit Item" : "Create New Item"}
                </h2>

                {/* Timeline Form */}
                {activeTab === "timeline" && (
                  <form
                    onSubmit={(e) => handleCreateOrUpdate(e, "timeline", formTimeline)}
                    className="space-y-4 text-sm"
                  >
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Event Title</label>
                      <input
                        type="text"
                        required
                        value={formTimeline.title}
                        onChange={(e) => setFormTimeline({ ...formTimeline, title: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                        placeholder="Our First Date"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Date Display String</label>
                      <input
                        type="text"
                        required
                        value={formTimeline.date}
                        onChange={(e) => setFormTimeline({ ...formTimeline, date: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                        placeholder="June 14, 2024"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Image URL / Path</label>
                      <input
                        type="text"
                        required
                        value={formTimeline.image}
                        onChange={(e) => setFormTimeline({ ...formTimeline, image: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                        placeholder="/images/gallery/meet.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Description</label>
                      <textarea
                        required
                        rows={3}
                        value={formTimeline.description}
                        onChange={(e) => setFormTimeline({ ...formTimeline, description: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500 resize-none"
                        placeholder="Write a sweet paragraph details of what happened..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Sorting Order Number</label>
                      <input
                        type="number"
                        required
                        value={formTimeline.order}
                        onChange={(e) => setFormTimeline({ ...formTimeline, order: parseInt(e.target.value) || 0 })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={actionLoading === "submitting"}
                        className="flex-grow bg-rose-600 hover:bg-rose-500 py-2.5 rounded-xl cursor-pointer text-white font-medium shadow-md flex items-center justify-center gap-1.5"
                      >
                        {actionLoading === "submitting" && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editingId ? "Save Changes" : "Save Event"}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForms}
                          className="px-4 py-2.5 rounded-xl border border-pink-500/15 text-pink-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {/* Memories Form */}
                {activeTab === "memories" && (
                  <form
                    onSubmit={(e) => handleCreateOrUpdate(e, "memories", formMemory)}
                    className="space-y-4 text-sm"
                  >
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Photo URL / Path</label>
                      <input
                        type="text"
                        required
                        value={formMemory.image}
                        onChange={(e) => setFormMemory({ ...formMemory, image: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                        placeholder="/images/gallery/pic1.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Caption Text</label>
                      <input
                        type="text"
                        required
                        value={formMemory.caption}
                        onChange={(e) => setFormMemory({ ...formMemory, caption: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                        placeholder="Walking under the sunset..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Date Display</label>
                      <input
                        type="text"
                        required
                        value={formMemory.date}
                        onChange={(e) => setFormMemory({ ...formMemory, date: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                        placeholder="2024-09"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Category Tab</label>
                      <input
                        type="text"
                        required
                        value={formMemory.category}
                        onChange={(e) => setFormMemory({ ...formMemory, category: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                        placeholder="Trips, Dates, Goofy"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={actionLoading === "submitting"}
                        className="flex-grow bg-rose-600 hover:bg-rose-500 py-2.5 rounded-xl cursor-pointer text-white font-medium flex items-center justify-center gap-1.5"
                      >
                        {actionLoading === "submitting" && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editingId ? "Save Changes" : "Save Memory"}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForms}
                          className="px-4 py-2.5 rounded-xl border border-pink-500/15 text-pink-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {/* Messages Form */}
                {activeTab === "messages" && (
                  <form
                    onSubmit={(e) => handleCreateOrUpdate(e, "messages", formMessage)}
                    className="space-y-4 text-sm"
                  >
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Letter Envelope Title</label>
                      <input
                        type="text"
                        required
                        value={formMessage.title}
                        onChange={(e) => setFormMessage({ ...formMessage, title: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                        placeholder="To My soulmate..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Letter Body Content</label>
                      <textarea
                        required
                        rows={6}
                        value={formMessage.content}
                        onChange={(e) => setFormMessage({ ...formMessage, content: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500 resize-none font-serif"
                        placeholder="Type the full love letter content here..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Sorting Order Number</label>
                      <input
                        type="number"
                        required
                        value={formMessage.order}
                        onChange={(e) => setFormMessage({ ...formMessage, order: parseInt(e.target.value) || 0 })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={actionLoading === "submitting"}
                        className="flex-grow bg-rose-600 hover:bg-rose-500 py-2.5 rounded-xl cursor-pointer text-white font-medium flex items-center justify-center gap-1.5"
                      >
                        {actionLoading === "submitting" && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editingId ? "Save Changes" : "Save Letter"}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForms}
                          className="px-4 py-2.5 rounded-xl border border-pink-500/15 text-pink-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {/* Videos Form */}
                {activeTab === "videos" && (
                  <form
                    onSubmit={(e) => handleCreateOrUpdate(e, "videos", formVideo)}
                    className="space-y-4 text-sm"
                  >
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Video Title</label>
                      <input
                        type="text"
                        required
                        value={formVideo.title}
                        onChange={(e) => setFormVideo({ ...formVideo, title: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                        placeholder="Our roadtrip memory"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Video URL / Path</label>
                      <input
                        type="text"
                        required
                        value={formVideo.videoUrl}
                        onChange={(e) => setFormVideo({ ...formVideo, videoUrl: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                        placeholder="/videos/our-trip.mp4"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Description</label>
                      <textarea
                        required
                        rows={3}
                        value={formVideo.description}
                        onChange={(e) => setFormVideo({ ...formVideo, description: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500 resize-none"
                        placeholder="Short summary details of the video..."
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={actionLoading === "submitting"}
                        className="flex-grow bg-rose-600 hover:bg-rose-500 py-2.5 rounded-xl cursor-pointer text-white font-medium flex items-center justify-center gap-1.5"
                      >
                        {actionLoading === "submitting" && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editingId ? "Save Changes" : "Save Video"}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForms}
                          className="px-4 py-2.5 rounded-xl border border-pink-500/15 text-pink-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {/* Reasons Form */}
                {activeTab === "reasons" && (
                  <form
                    onSubmit={(e) => handleCreateOrUpdate(e, "reasons", formReason)}
                    className="space-y-4 text-sm"
                  >
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Love Card Title</label>
                      <input
                        type="text"
                        required
                        value={formReason.title}
                        onChange={(e) => setFormReason({ ...formReason, title: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                        placeholder="Your Kindness"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Lucide Icon Name</label>
                      <input
                        type="text"
                        required
                        value={formReason.icon}
                        onChange={(e) => setFormReason({ ...formReason, icon: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                        placeholder="Smile, Heart, Sun, Music"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Story Description</label>
                      <textarea
                        required
                        rows={4}
                        value={formReason.description}
                        onChange={(e) => setFormReason({ ...formReason, description: e.target.value })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500 resize-none"
                        placeholder="Explain this reason in detail..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-pink-300/60 font-medium mb-1.5">Sorting Order Number</label>
                      <input
                        type="number"
                        required
                        value={formReason.order}
                        onChange={(e) => setFormReason({ ...formReason, order: parseInt(e.target.value) || 0 })}
                        className="w-full bg-pink-950/15 border border-pink-500/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={actionLoading === "submitting"}
                        className="flex-grow bg-rose-600 hover:bg-rose-500 py-2.5 rounded-xl cursor-pointer text-white font-medium flex items-center justify-center gap-1.5"
                      >
                        {actionLoading === "submitting" && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editingId ? "Save Changes" : "Save Reason"}
                      </button>
                      {editingId && (
                        <button
                          type="button"
                          onClick={resetForms}
                          className="px-4 py-2.5 rounded-xl border border-pink-500/15 text-pink-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* List Column */}
            <div className="lg:col-span-7">
              <div className="glass-panel border border-pink-500/10 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[70vh] overflow-y-auto">
                <h2 className="text-xl font-serif font-bold text-pink-100 mb-4">
                  Active Items List
                </h2>

                {/* Timeline Items Listing */}
                {activeTab === "timeline" && timelineItems.length === 0 && (
                  <p className="text-sm text-pink-300/40 text-center py-10">No items available. Press 'Seed Demo Data' to begin!</p>
                )}
                {activeTab === "timeline" && timelineItems.map((item) => (
                  <div key={item._id} className="flex gap-4 p-4 rounded-xl border border-pink-500/5 bg-pink-950/5 hover:bg-pink-950/10 justify-between items-center text-sm">
                    <div className="flex gap-3 items-center truncate">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg border border-pink-500/10" />
                      <div className="truncate">
                        <p className="font-semibold text-pink-100 truncate">{item.title}</p>
                        <p className="text-xs text-pink-300/40">{item.date} • Order: {item.order}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(item, "timeline")} className="p-2 rounded-lg bg-pink-950/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete("timeline", item._id)} className="p-2 rounded-lg bg-pink-950/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}

                {/* Memories Items Listing */}
                {activeTab === "memories" && memoriesItems.length === 0 && (
                  <p className="text-sm text-pink-300/40 text-center py-10">No items available. Press 'Seed Demo Data' to begin!</p>
                )}
                {activeTab === "memories" && memoriesItems.map((item) => (
                  <div key={item._id} className="flex gap-4 p-4 rounded-xl border border-pink-500/5 bg-pink-950/5 hover:bg-pink-950/10 justify-between items-center text-sm">
                    <div className="flex gap-3 items-center truncate">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt={item.caption} className="w-12 h-12 object-cover rounded-lg border border-pink-500/10" />
                      <div className="truncate">
                        <p className="font-semibold text-pink-100 truncate">{item.caption}</p>
                        <p className="text-xs text-pink-300/40">{item.category} • {item.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(item, "memories")} className="p-2 rounded-lg bg-pink-950/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete("memories", item._id)} className="p-2 rounded-lg bg-pink-950/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}

                {/* Messages Items Listing */}
                {activeTab === "messages" && messagesItems.length === 0 && (
                  <p className="text-sm text-pink-300/40 text-center py-10">No items available. Press 'Seed Demo Data' to begin!</p>
                )}
                {activeTab === "messages" && messagesItems.map((item) => (
                  <div key={item._id} className="flex gap-4 p-4 rounded-xl border border-pink-500/5 bg-pink-950/5 hover:bg-pink-950/10 justify-between items-center text-sm">
                    <div className="truncate">
                      <p className="font-semibold text-pink-100 truncate">{item.title}</p>
                      <p className="text-xs text-pink-300/40">Order: {item.order}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(item, "messages")} className="p-2 rounded-lg bg-pink-950/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete("messages", item._id)} className="p-2 rounded-lg bg-pink-950/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}

                {/* Videos Items Listing */}
                {activeTab === "videos" && videosItems.length === 0 && (
                  <p className="text-sm text-pink-300/40 text-center py-10">No items available. Press 'Seed Demo Data' to begin!</p>
                )}
                {activeTab === "videos" && videosItems.map((item) => (
                  <div key={item._id} className="flex gap-4 p-4 rounded-xl border border-pink-500/5 bg-pink-950/5 hover:bg-pink-950/10 justify-between items-center text-sm">
                    <div className="truncate">
                      <p className="font-semibold text-pink-100 truncate">{item.title}</p>
                      <p className="text-xs text-pink-300/40 truncate">{item.videoUrl}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(item, "videos")} className="p-2 rounded-lg bg-pink-950/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete("videos", item._id)} className="p-2 rounded-lg bg-pink-950/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}

                {/* Reasons Items Listing */}
                {activeTab === "reasons" && reasonsItems.length === 0 && (
                  <p className="text-sm text-pink-300/40 text-center py-10">No items available. Press 'Seed Demo Data' to begin!</p>
                )}
                {activeTab === "reasons" && reasonsItems.map((item) => (
                  <div key={item._id} className="flex gap-4 p-4 rounded-xl border border-pink-500/5 bg-pink-950/5 hover:bg-pink-950/10 justify-between items-center text-sm">
                    <div className="truncate flex gap-3 items-center">
                      <span className="p-2 rounded-lg bg-pink-950 border border-pink-500/10 text-rose-400 font-bold uppercase tracking-wider">{item.icon}</span>
                      <div className="truncate">
                        <p className="font-semibold text-pink-100 truncate">{item.title}</p>
                        <p className="text-xs text-pink-300/40">Order: {item.order}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(item, "reasons")} className="p-2 rounded-lg bg-pink-950/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete("reasons", item._id)} className="p-2 rounded-lg bg-pink-950/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
