import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, MapPin, Wallet, Globe, Star, ArrowRight, Users, Calendar, Shield, Zap } from "lucide-react";

const HERO_BG = "https://images.pexels.com/photos/30264519/pexels-photo-30264519.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1024&w=1536";

const DESTINATIONS = [
  { id: "kashmir", name: "Kashmir", tag: "Trending", image: "https://images.unsplash.com/photo-1716099934086-d64a79d43297?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxLYXNobWlyJTIwdmFsbGV5JTIwc2NlbmljJTIwYmVhdXR5JTIwSW5kaWF8ZW58MHx8fHwxNzc2OTQ3OTAzfDA&ixlib=rb-4.1.0&q=85", className: "bento-wide" },
  { id: "ladakh", name: "Ladakh", tag: "Adventure", image: "https://images.unsplash.com/photo-1756201409420-00f93939f9d1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHwxfHxMYWRha2glMjBtb3VudGFpbiUyMGxhbmRzY2FwZSUyMGNpbmVtYXRpYyUyMEluZGlhfGVufDB8fHx8MTc3Njk0Nzg5Nnww&ixlib=rb-4.1.0&q=85", className: "bento-tall" },
  { id: "kerala", name: "Kerala", tag: "Backwaters", image: "https://images.unsplash.com/photo-1593417034675-3ed7eda1bee9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwyfHxLZXJhbGElMjBiYWNrd2F0ZXJzJTIwaG91c2Vib2F0JTIwSW5kaWF8ZW58MHx8fHwxNzc2OTQ3OTE0fDA&ixlib=rb-4.1.0&q=85", className: "" },
  { id: "rajasthan", name: "Rajasthan", tag: "Heritage", image: "https://images.unsplash.com/photo-1673115955449-4e50a5e78c9c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwyfHxSYWphc3RoYW4lMjBwYWxhY2UlMjBkZXNlcnQlMjBJbmRpYSUyMEphaXB1cnxlbnwwfHx8fDE3NzY5NDc5MjB8MA&ixlib=rb-4.1.0&q=85", className: "" },
  { id: "varanasi", name: "Varanasi", tag: "Spiritual", image: "https://images.pexels.com/photos/17869831/pexels-photo-17869831.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", className: "bento-wide" },
];

const FEATURES = [
  { icon: Sparkles, title: "AI Trip Planner", desc: "Generate personalized day-by-day itineraries for any Indian destination with AI." },
  { icon: Wallet, title: "Smart Budget in INR", desc: "Real-time cost estimation in Rupees — trains, homestays, street food, and more." },
  { icon: Globe, title: "Discover India", desc: "Explore hill stations, beaches, heritage sites, hidden gems, and backpacking routes." },
  { icon: Shield, title: "Travel Insights", desc: "Monsoon alerts, festival timing, regional tips, and seasonal travel guidance." },
  { icon: Zap, title: "AI Chat Assistant", desc: "Get instant advice on Indian destinations, local food, and travel hacks." },
  { icon: Calendar, title: "Trip Management", desc: "Save, organize, and manage all your India travel plans in one place." },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Solo Backpacker", text: "WanderLust planned my Spiti Valley bike trip perfectly. The budget breakdown in INR was super helpful!", rating: 5 },
  { name: "Arjun Nair", role: "Weekend Explorer", text: "Found the most amazing hidden waterfalls in Meghalaya through WanderLust. The AI recommendations are gold!", rating: 5 },
  { name: "Sneha Reddy", role: "Family Traveler", text: "Planned our Rajasthan road trip with the kids using WanderLust. Every recommendation felt personally curated.", rating: 5 },
];

const fadeInUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } };

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/planner?destination=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="overflow-hidden">
      {/* ──────── HERO ──────── */}
      <section className="relative min-h-screen flex items-center" data-testid="hero-section">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="Desert landscape" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-32">
          <motion.p
            className="text-white/70 text-sm uppercase tracking-[0.25em] font-medium mb-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            AI-Powered India Travel Planning
          </motion.p>
          <motion.h1
            className="text-white text-5xl sm:text-6xl lg:text-7xl tracking-tight font-light leading-[1.1] max-w-3xl"
            style={{ fontFamily: "Outfit" }}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
          >
            Discover the<br /><span className="font-normal">Soul of India.</span>
          </motion.h1>
          <motion.p
            className="text-white/70 text-base md:text-lg max-w-xl mt-6 leading-relaxed"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}
          >
            AI-powered travel planning for unforgettable journeys across India — from the Himalayas to the backwaters, deserts to beaches.
          </motion.p>

          {/* Search Bar */}
          <motion.form
            onSubmit={handleSearch}
            className="mt-10 flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full overflow-hidden max-w-lg"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Search size={18} className="text-white/60 ml-5" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Where in India do you want to go?"
              className="flex-1 bg-transparent text-white placeholder:text-white/40 px-4 py-4 text-sm outline-none"
              data-testid="hero-search-input"
            />
            <Button type="submit" className="rounded-full m-1.5 px-6 bg-white text-[#1C1C1C] hover:bg-white/90" data-testid="hero-search-btn">
              Explore
            </Button>
          </motion.form>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Button
              size="lg"
              className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:-translate-y-0.5 transition-all"
              onClick={() => navigate("/planner")}
              data-testid="hero-plan-trip-btn"
            >
              Plan My India Trip <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 border-white/30 text-white hover:bg-white/10"
              onClick={() => navigate("/destinations")}
              data-testid="hero-explore-btn"
            >
              Explore India
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ──────── STATS ──────── */}
      <section className="py-12 border-b border-border bg-card" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            {[{ num: "50K+", label: "Indian Travelers" }, { num: "100+", label: "Indian Destinations" }, { num: "15K+", label: "Trips Planned" }, { num: "4.9", label: "User Rating" }].map((stat, i) => (
              <motion.div key={i} className="text-center" {...fadeInUp} transition={{ ...fadeInUp.transition, delay: i * 0.1 }}>
                <p className="text-3xl md:text-4xl font-bold text-primary" style={{ fontFamily: "Outfit" }}>{stat.num}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── FEATURES ──────── */}
      <section className="py-24 md:py-32" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <p className="text-sm uppercase tracking-[0.2em] font-medium text-accent mb-4">Why WanderLust</p>
            <h2 className="text-4xl sm:text-5xl tracking-tight font-normal" style={{ fontFamily: "Outfit" }}>
              Everything You Need to<br /><span className="font-medium">Travel Smarter</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={i}
                className="bg-card rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 card-hover"
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: i * 0.08 }}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <feat.icon size={22} className="text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ fontFamily: "Outfit" }}>{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── DESTINATIONS BENTO ──────── */}
      <section className="py-24 md:py-32 bg-muted/30" data-testid="destinations-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4" {...fadeInUp}>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] font-medium text-accent mb-4">Popular Destinations</p>
              <h2 className="text-4xl sm:text-5xl tracking-tight font-normal" style={{ fontFamily: "Outfit" }}>
                Where to <span className="font-medium">Next?</span>
              </h2>
            </div>
            <Link to="/destinations" className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
              View all destinations <ArrowRight size={14} />
            </Link>
          </motion.div>
          <div className="bento-grid">
            {DESTINATIONS.map((dest, i) => (
              <motion.div
                key={dest.id}
                className={`relative rounded-3xl overflow-hidden group cursor-pointer min-h-[240px] md:min-h-[280px] ${dest.className}`}
                onClick={() => navigate(`/planner?destination=${encodeURIComponent(dest.name)}`)}
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
                data-testid={`destination-card-${dest.id}`}
              >
                <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">{dest.tag}</span>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="text-white text-xl font-medium" style={{ fontFamily: "Outfit" }}>{dest.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── AI SHOWCASE ──────── */}
      <section className="py-24 md:py-32" data-testid="ai-showcase-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp}>
              <p className="text-sm uppercase tracking-[0.2em] font-medium text-accent mb-4">AI-Powered Planning</p>
              <h2 className="text-4xl sm:text-5xl tracking-tight font-normal mb-6" style={{ fontFamily: "Outfit" }}>
                Your Personal<br /><span className="font-medium">Travel Genius</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Tell us your dream Indian destination, budget in INR, and interests. Our AI creates a complete day-by-day itinerary with local experiences, street food recommendations, transport options, and insider tips.
              </p>
              <div className="space-y-4 mb-8">
                {["Personalized day-by-day itineraries for India", "Smart budget estimation in ₹ INR", "Local street food & regional cuisine recommendations", "Train, bus, bike & road trip route suggestions"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles size={12} className="text-primary" />
                    </div>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <Button className="rounded-full px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.1)]" onClick={() => navigate("/planner")} data-testid="ai-showcase-cta">
                Try AI Planner <ArrowRight size={16} className="ml-2" />
              </Button>
            </motion.div>
            <motion.div className="relative" {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
              <div className="bg-card rounded-3xl border border-border shadow-[0_20px_40px_rgb(0,0,0,0.06)] p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-xs text-muted-foreground ml-2">AI Trip Planner</span>
                </div>
                <div className="space-y-3">
                  <div className="bg-muted rounded-2xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Destination</p>
                    <p className="text-sm font-medium">Manali, Himachal Pradesh</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted rounded-2xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Duration</p>
                      <p className="text-sm font-medium">5 Days</p>
                    </div>
                    <div className="bg-muted rounded-2xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Budget</p>
                      <p className="text-sm font-medium">₹25,000</p>
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-primary" />
                      <p className="text-xs font-medium text-primary">AI Generated Itinerary</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Day 1: Hadimba Temple, Mall Road, Manu Temple, Old Manali cafe hopping...</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────── TESTIMONIALS ──────── */}
      <section className="py-24 md:py-32 bg-muted/30" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <p className="text-sm uppercase tracking-[0.2em] font-medium text-accent mb-4">Testimonials</p>
            <h2 className="text-4xl sm:text-5xl tracking-tight font-normal" style={{ fontFamily: "Outfit" }}>
              Loved by <span className="font-medium">Travelers</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                className="bg-card rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50"
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: i * 0.1 }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── FINAL CTA ──────── */}
      <section className="py-24 md:py-32" data-testid="cta-section">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            className="bg-primary rounded-3xl p-12 md:p-16 text-center text-primary-foreground relative overflow-hidden"
            {...fadeInUp}
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 0%, transparent 60%)" }} />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight font-light mb-4" style={{ fontFamily: "Outfit" }}>
                Ready to Explore<br /><span className="font-medium">Incredible India?</span>
              </h2>
              <p className="text-base opacity-80 max-w-md mx-auto mb-8">
                Join 50,000+ Indian travelers who plan smarter and explore more with WanderLust AI.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="rounded-full px-10 bg-white text-primary hover:bg-white/90 shadow-lg hover:-translate-y-0.5 transition-all"
                  onClick={() => navigate("/register")}
                  data-testid="cta-get-started-btn"
                >
                  Get Started Free <ArrowRight size={16} className="ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 border-white/30 text-white hover:bg-white/10"
                  onClick={() => navigate("/destinations")}
                  data-testid="cta-explore-btn"
                >
                  Browse Destinations
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
