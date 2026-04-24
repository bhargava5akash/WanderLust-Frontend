import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, IndianRupee, Trash2, Plus, Loader2, Compass, Clock } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadTrips(); }, []);

  const loadTrips = async () => {
    try {
      const { data } = await api.get("/trips");
      setTrips(data);
    } catch {
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      await api.delete(`/trips/${tripId}`);
      setTrips(prev => prev.filter(t => t.id !== tripId));
      toast.success("Trip deleted");
    } catch {
      toast.error("Failed to delete trip");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="dashboard-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] font-medium text-accent mb-3">Dashboard</p>
            <h1 className="text-4xl sm:text-5xl tracking-tight font-light" style={{ fontFamily: "Outfit" }}>
              Welcome, <span className="font-medium">{user?.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-muted-foreground mt-2">Manage your trips and plan new adventures.</p>
          </div>
          <Button className="rounded-full px-6 shrink-0" onClick={() => navigate("/planner")} data-testid="new-trip-btn">
            <Plus size={16} className="mr-2" /> Plan New Trip
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {[
            { icon: Compass, label: "Total Trips", value: trips.length },
            { icon: MapPin, label: "Destinations", value: new Set(trips.map(t => t.destination)).size },
            { icon: Calendar, label: "Travel Days", value: trips.reduce((a, t) => a + (t.duration || 0), 0) },
            { icon: IndianRupee, label: "Budget Planned", value: `₹${trips.reduce((a, t) => a + (t.budget || 0), 0).toLocaleString('en-IN')}` },
          ].map((stat, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <stat.icon size={18} className="text-accent mb-3" strokeWidth={1.5} />
              <p className="text-2xl font-bold" style={{ fontFamily: "Outfit" }}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Trips */}
        <Tabs defaultValue="all">
          <TabsList className="rounded-full bg-muted p-1 mb-6">
            <TabsTrigger value="all" className="rounded-full text-xs">All Trips</TabsTrigger>
            <TabsTrigger value="planned" className="rounded-full text-xs">Planned</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={28} className="animate-spin text-primary" />
              </div>
            ) : trips.length === 0 ? (
              <motion.div className="bg-card rounded-3xl border border-border/50 p-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Compass size={40} className="text-muted-foreground mx-auto mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-medium mb-2" style={{ fontFamily: "Outfit" }}>No trips yet</h3>
                <p className="text-sm text-muted-foreground mb-6">Start planning your first adventure with our AI trip planner.</p>
                <Button className="rounded-full px-8" onClick={() => navigate("/planner")} data-testid="empty-plan-btn">
                  Plan Your First Trip
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trips.map((trip, i) => (
                  <motion.div
                    key={trip.id}
                    className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 card-hover"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    data-testid={`trip-card-${i}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium" style={{ fontFamily: "Outfit" }}>
                          {trip.trip_data?.trip_name || trip.destination}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <MapPin size={12} /> {trip.destination}
                        </div>
                      </div>
                      <span className="px-3 py-1 text-[10px] font-medium rounded-full bg-primary/10 text-primary capitalize">{trip.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {trip.trip_data?.summary || `${trip.duration}-day trip to ${trip.destination}`}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {trip.duration} days</span>
                      {trip.budget && <span className="flex items-center gap-1"><IndianRupee size={12} /> ₹{trip.budget?.toLocaleString('en-IN')}</span>}
                      <span className="flex items-center gap-1"><Clock size={12} /> {new Date(trip.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-full text-xs flex-1" onClick={() => navigate(`/planner?destination=${encodeURIComponent(trip.destination)}`)} data-testid={`trip-replan-${i}`}>
                        Re-plan
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteTrip(trip.id)} data-testid={`trip-delete-${i}`}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="planned">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trips.filter(t => t.status === "planned").map((trip, i) => (
                <div key={trip.id} className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6" data-testid={`planned-trip-${i}`}>
                  <h3 className="text-lg font-medium" style={{ fontFamily: "Outfit" }}>{trip.trip_data?.trip_name || trip.destination}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{trip.duration} days &middot; ₹{trip.budget?.toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
