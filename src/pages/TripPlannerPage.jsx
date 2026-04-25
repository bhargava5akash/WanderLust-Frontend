import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Loader2, MapPin, Clock, IndianRupee, Utensils, Lightbulb, Bookmark, Calendar, Users, Star } from "lucide-react";
import { toast } from "sonner";
import WeatherSection from "@/components/WeatherSection";

const INTERESTS = ["Adventure", "Food", "Culture", "Nightlife", "Nature", "Luxury", "Backpacking", "Photography", "Spiritual", "Wellness", "Trekking", "Road Trip"];

const TRAVEL_MODES = ["Any", "Train", "Bus", "Flight", "Bike", "Car"];

export default function TripPlannerPage() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    destination: searchParams.get("destination") || "",
    budget: "",
    duration: "",
    travel_style: "balanced",
    num_travelers: "",
    interests: [],
    travel_mode: "any",
  });
  const [generating, setGenerating] = useState(false);
  const [trip, setTrip] = useState(null);
  const [saving, setSaving] = useState(false);

  const toggleInterest = (interest) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const generateTrip = async (e) => {
    e.preventDefault();
    if (!form.destination.trim()) { toast.error("Please enter a destination"); return; }
    setGenerating(true);
    setTrip(null);
    try {
      console.log("Sending request");

      const { data } = await api.post("/trips/generate", {
        ...form,
        interests: form.interests.map(i => i.toLowerCase()),
      });
      console.log("FULL DATA:", data);
console.log("TRIP:", data.trip);
console.log("FOOD:", data.trip.food_recommendations);
console.log("TIPS:", data.trip.travel_tips);
      if (data.trip) {
    setTrip(data.trip);

    toast.success("Itinerary generated!");
}
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to generate itinerary. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const saveTrip = async () => {
    if (!trip) return;
    setSaving(true);
    try {
      await api.post("/trips/save", {
        trip_data: trip,
        destination: form.destination,
        duration: form.duration,
        budget: form.budget,
      });
      toast.success("Trip saved to your dashboard!");
    } catch (err) {
      toast.error("Failed to save trip");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="trip-planner-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-sm uppercase tracking-[0.2em] font-medium text-accent mb-3">AI Trip Planner</p>
          <h1 className="text-4xl sm:text-5xl tracking-tight font-light" style={{ fontFamily: "Outfit" }}>
            Plan Your <span className="font-medium">India Trip</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-lg">Tell us about your dream Indian getaway, and our AI will create a personalized day-by-day itinerary with local experiences.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <form onSubmit={generateTrip} className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-5 sticky top-28">
              <div>
                <Label>Destination</Label>
                <div className="relative mt-1.5">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} placeholder="e.g., Manali, Ladakh, Goa" className="rounded-xl pl-10" required data-testid="planner-destination-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration (days)</Label>
                  <Input type="number" min={1} max={30} value={form.duration ||""} onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 1 }))} className="rounded-xl mt-1.5" data-testid="planner-duration-input" />
                </div>
                <div>
                  <Label>Budget (₹)</Label>
                  <Input type="number" min={1000} value={form.budget ||""} onChange={e => setForm(f => ({ ...f, budget: parseInt(e.target.value) || 1000 }))} className="rounded-xl mt-1.5" data-testid="planner-budget-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Travel Style</Label>
                  <Select value={form.travel_style} onValueChange={v => setForm(f => ({ ...f, travel_style: v }))}>
                    <SelectTrigger className="rounded-xl mt-1.5" data-testid="planner-style-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget</SelectItem>
                      <SelectItem value="backpacking">Backpacking</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Travelers</Label>
                  <Input type="number" min={1} max={20} value={form.num_travelers || ""} onChange={e => setForm(f => ({ ...f, num_travelers: parseInt(e.target.value) || 1 }))} className="rounded-xl mt-1.5" data-testid="planner-travelers-input" />
                </div>
              </div>
              <div>
                <Label>Travel Mode</Label>
                <Select value={form.travel_mode} onValueChange={v => setForm(f => ({ ...f, travel_mode: v }))}>
                  <SelectTrigger className="rounded-xl mt-1.5" data-testid="planner-mode-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAVEL_MODES.map(mode => (
                      <SelectItem key={mode.toLowerCase()} value={mode.toLowerCase()}>{mode}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2">Interests</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {INTERESTS.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                        form.interests.includes(interest)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border hover:border-primary/30"
                      }`}
                      data-testid={`interest-${interest.toLowerCase()}`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full rounded-full py-5" disabled={generating} data-testid="planner-generate-btn">
                {generating ? (
                  <><Loader2 size={18} className="animate-spin mr-2" /> Generating Itinerary...</>
                ) : (
                  <><Sparkles size={18} className="mr-2" /> Generate AI Itinerary</>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Results */}
          <div className="lg:col-span-3">
            {!trip && !generating && (
              <div className="space-y-6">
                <div className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Sparkles size={28} className="text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-medium mb-2" style={{ fontFamily: "Outfit" }}>Your Itinerary Awaits</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">Fill in your trip details and let our AI create a personalized travel plan for you.</p>
                </div>
                {form.destination.trim() && (
                  <WeatherSection destination={form.destination} />
                )}
              </div>
            )}

            {generating && (
              <div className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center">
                <Loader2 size={40} className="animate-spin text-primary mx-auto mb-5" />
                <h3 className="text-xl font-medium mb-2" style={{ fontFamily: "Outfit" }}>Crafting Your Perfect Trip...</h3>
                <p className="text-sm text-muted-foreground">Our AI is planning your itinerary with the best local experiences.</p>
              </div>
            )}

            {trip && (
              <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Trip Header */}
                <div className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-medium" style={{ fontFamily: "Outfit" }}>{trip.trip_name || trip.destination}</h2>
                      <p className="text-sm text-muted-foreground mt-1">{trip.summary}</p>
                    </div>
                    <Button variant="outline" className="rounded-full shrink-0" onClick={saveTrip} disabled={saving} data-testid="save-trip-btn">
                      <Bookmark size={16} className="mr-2" /> {saving ? "Saving..." : "Save Trip"}
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar size={14} /> {trip.duration || form.duration} days
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <IndianRupee size={14} /> ₹{trip.budget_breakdown?.total?.toLocaleString('en-IN') || form.budget?.toLocaleString('en-IN')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users size={14} /> {form.num_travelers} travelers
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="itinerary" className="space-y-4">
                  <TabsList className="rounded-full bg-muted p-1">
                    <TabsTrigger value="itinerary" className="rounded-full text-xs" data-testid="tab-itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="budget" className="rounded-full text-xs" data-testid="tab-budget">Budget</TabsTrigger>
                    <TabsTrigger value="weather" className="rounded-full text-xs" data-testid="tab-weather">Weather</TabsTrigger>
                    <TabsTrigger value="food" className="rounded-full text-xs" data-testid="tab-food">Food</TabsTrigger>
                    <TabsTrigger value="tips" className="rounded-full text-xs" data-testid="tab-tips">Tips</TabsTrigger>
                  </TabsList>

                  <TabsContent value="itinerary" className="space-y-4">
  <div className="bg-card rounded-2xl border border-border/50 p-4">
    <pre className="text-white whitespace-pre-wrap">
      {JSON.stringify(trip, null, 2)}
    </pre>
  </div>
</TabsContent>

                  <TabsContent value="budget">
                    <div className="bg-card rounded-2xl border border-border/50 p-6">
                      <h4 className="font-medium mb-4" style={{ fontFamily: "Outfit" }}>Budget Breakdown</h4>
                      {trip.budget_breakdown && Object.entries(trip.budget_breakdown).filter(([k]) => k !== "total").map(([key, val]) => (
                        <div key={key} className="flex justify-between items-center py-2.5 border-b border-border/30 last:border-0">
                          <span className="text-sm capitalize">{key}</span>
                          <span className="text-sm font-medium">₹{val?.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                      {trip.budget_breakdown?.total && (
                        <div className="flex justify-between items-center pt-3 mt-1">
                          <span className="font-medium">Total Estimated</span>
                          <span className="text-lg font-bold text-primary">₹{trip.budget_breakdown.total?.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="weather">
                    <WeatherSection destination={form.destination} />
                  </TabsContent>

  
  <TabsContent value="food" className="space-y-4">
  {(trip.food_recommendations || []).map((food, index) => (
    <div
      key={index}
      className="bg-card rounded-2xl border border-border/50 p-4"
    >
      {food}
    </div>
  ))}
</TabsContent>

                  <TabsContent value="tips" className="space-y-4">
  {(trip.travel_tips || []).map((tip, index) => (
    <div
      key={index}
      className="bg-card rounded-2xl border border-border/50 p-4"
    >
      {tip}
    </div>
  ))}
</TabsContent>
                </Tabs>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
