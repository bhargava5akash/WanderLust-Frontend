import { Link } from "react-router-dom";
import { Compass, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Outfit" }}>
              Wander<span className="text-[hsl(150,25%,50%)]">Lust</span>
            </Link>
            <p className="mt-4 text-sm opacity-70 leading-relaxed">
              AI-powered travel planning for unforgettable journeys across India — from mountains to backwaters, deserts to beaches.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "Outfit" }}>Explore</h4>
            <div className="flex flex-col gap-3">
              <Link to="/destinations" className="text-sm opacity-70 hover:opacity-100 transition-opacity">Destinations</Link>
              <Link to="/planner" className="text-sm opacity-70 hover:opacity-100 transition-opacity">Trip Planner</Link>
              <Link to="/budget" className="text-sm opacity-70 hover:opacity-100 transition-opacity">Budget Calculator</Link>
              <Link to="/dashboard" className="text-sm opacity-70 hover:opacity-100 transition-opacity">My Trips</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "Outfit" }}>Company</h4>
            <div className="flex flex-col gap-3">
              <span className="text-sm opacity-70">About Us</span>
              <span className="text-sm opacity-70">Privacy Policy</span>
              <span className="text-sm opacity-70">Terms of Service</span>
              <span className="text-sm opacity-70">Contact</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "Outfit" }}>Connect</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Mail size={14} /> hello@wanderlust.ai
              </div>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <MapPin size={14} /> San Francisco, CA
              </div>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Compass size={14} /> Explore the world
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-50">&copy; 2026 WanderLust. All rights reserved.</p>
          <p className="text-xs opacity-50">Crafted with passion for Indian explorers.</p>
        </div>
      </div>
    </footer>
  );
}
