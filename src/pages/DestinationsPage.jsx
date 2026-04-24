import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { MapPin, Star, IndianRupee, Search, ArrowRight, CloudSun } from "lucide-react";

function MiniWeather({ destination }) {
  const [w, setW] = useState(null);
  useEffect(() => {
    api.get(`/weather/${encodeURIComponent(destination)}`).then(({ data }) => setW(data?.current)).catch(() => {});
  }, [destination]);
  if (!w) return null;
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground" data-testid={`mini-weather-${destination}`}>
      {w.icon && <img src={`https://openweathermap.org/img/wn/${w.icon}.png`} alt="" width={24} height={24} />}
      <span>{w.temp_c}°C</span>
      {w.rain_probability > 40 && <span className="text-accent">({w.rain_probability}% rain)</span>}
    </div>
  );
}

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "trending", label: "Trending" },
  { id: "hill_station", label: "Hill Stations" },
  { id: "beach", label: "Beaches" },
  { id: "spiritual", label: "Spiritual" },
  { id: "adventure", label: "Adventure" },
  { id: "heritage", label: "Heritage" },
  { id: "hidden_gem", label: "Hidden Gems" },
];

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDestinations();
  }, [activeCategory]);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/destinations?category=${activeCategory}`);
      setDestinations(data);
    } catch {
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.state || d.country || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="destinations-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.2em] font-medium text-accent mb-3">Discover India</p>
          <h1 className="text-4xl sm:text-5xl tracking-tight font-light" style={{ fontFamily: "Outfit" }}>
            Explore <span className="font-medium">Incredible India</span>
          </h1>
        </motion.div>

        {/* Filters */}
        <motion.div className="flex flex-col md:flex-row gap-4 mb-10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Indian destinations..."
              className="w-full bg-card border border-border rounded-full px-10 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              data-testid="destinations-search"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/30"
                }`}
                data-testid={`filter-${cat.id}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-card rounded-3xl border border-border/50 overflow-hidden animate-pulse">
                <div className="h-56 bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-2/3 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dest, i) => (
              <motion.div
                key={dest.id}
                className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden card-hover cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                onClick={() => navigate(`/planner?destination=${encodeURIComponent(dest.name)}`)}
                data-testid={`dest-card-${dest.id}`}
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 text-foreground capitalize">{dest.category.replace("_", " ")}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium" style={{ fontFamily: "Outfit" }}>{dest.name}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{dest.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{dest.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <IndianRupee size={14} />
                      <span>From ₹{dest.avg_cost}/day</span>
                    </div>
                    <MiniWeather destination={dest.name.split(",")[0]} />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex gap-1.5">
                      {dest.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted text-muted-foreground capitalize">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Plan trip <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <MapPin size={40} className="text-muted-foreground mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="text-lg font-medium mb-2" style={{ fontFamily: "Outfit" }}>No destinations found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
