import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Droplets, Wind, Eye, Thermometer, CloudRain, AlertTriangle, Lightbulb, Backpack, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

const ICON_URL = "https://openweathermap.org/img/wn";

function WeatherIcon({ code, size = 48 }) {
  if (!code) return null;
  return <img src={`${ICON_URL}/${code}@2x.png`} alt="weather" width={size} height={size} className="drop-shadow-sm" />;
}

export default function WeatherSection({ destination, compact = false }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!destination) return;
    let cancelled = false;
    setLoading(true);
    setError(false);
    api.get(`/weather/${encodeURIComponent(destination)}`)
      .then(({ data }) => { if (!cancelled) setWeather(data); })
      .catch(() => { if (!cancelled) setError(true); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [destination]);

  if (!destination) return null;
  if (loading) return (
    <div className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 flex items-center justify-center gap-3" data-testid="weather-loading">
      <Loader2 size={20} className="animate-spin text-primary" />
      <span className="text-sm text-muted-foreground">Fetching live weather...</span>
    </div>
  );
  if (error || !weather) return null;

  const c = weather.current;
  if (!c) return null;
  const forecast = weather.forecast || [];
  const insights = weather.travel_insights || { insights: [], alerts: [] };
  const packing = weather.packing_suggestions || [];

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-muted/50 border border-border/30" data-testid="weather-compact">
        <WeatherIcon code={c.icon} size={36} />
        <div>
          <span className="text-sm font-medium">{c.temp_c}°C</span>
          <span className="text-xs text-muted-foreground ml-2">{c.description}</span>
        </div>
        {c.rain_probability > 40 && (
          <span className="ml-auto text-xs text-accent flex items-center gap-1"><CloudRain size={12} />{c.rain_probability}%</span>
        )}
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      data-testid="weather-section"
    >
      {/* Current Weather Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="bg-gradient-to-br from-primary/5 via-card to-accent/5 p-6 md:p-8">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs uppercase tracking-[0.15em] font-medium text-accent" style={{ fontFamily: "Outfit" }}>Live Weather</p>
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {weather.source === "openweathermap" ? "OpenWeatherMap" : "Estimated"}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <WeatherIcon code={c.icon} size={64} />
              <div>
                <p className="text-4xl font-light tracking-tight" style={{ fontFamily: "Outfit" }}>{c.temp_c}°<span className="text-lg">C</span></p>
                <p className="text-sm text-muted-foreground">Feels like {c.feels_like}°C</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-base font-medium" style={{ fontFamily: "Outfit" }}>{c.description}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{destination}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { icon: Droplets, label: "Humidity", value: `${c.humidity}%` },
              { icon: Wind, label: "Wind", value: `${c.wind_kph} km/h` },
              { icon: CloudRain, label: "Rain", value: `${c.rain_probability}%` },
              { icon: Eye, label: "Visibility", value: `${c.visibility} km` },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/30 dark:border-white/10">
                <stat.icon size={15} className="text-accent shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-xs text-muted-foreground leading-none">{stat.label}</p>
                  <p className="text-sm font-medium leading-tight mt-0.5">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <div className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8">
          <p className="text-sm font-medium mb-4" style={{ fontFamily: "Outfit" }}>5-Day Forecast</p>
          <div className="grid grid-cols-5 gap-2">
            {forecast.map((day, i) => (
              <div key={i} className="text-center p-2 rounded-2xl hover:bg-muted/50 transition-colors" data-testid={`forecast-day-${i}`}>
                <p className="text-xs font-medium">{day.day}</p>
                <p className="text-[10px] text-muted-foreground">{day.date}</p>
                <WeatherIcon code={day.icon} size={36} />
                <p className="text-sm font-medium">{day.high}°</p>
                <p className="text-xs text-muted-foreground">{day.low}°</p>
                {day.rain_chance > 30 && (
                  <p className="text-[10px] text-accent mt-0.5 flex items-center justify-center gap-0.5"><CloudRain size={9} />{day.rain_chance}%</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts + Insights + Packing (Expandable) */}
      {(insights.alerts.length > 0 || insights.insights.length > 0 || packing.length > 0) && (
        <div className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          {/* Alerts (always visible) */}
          {insights.alerts.length > 0 && (
            <div className="px-6 py-4 bg-destructive/5 border-b border-destructive/10">
              {insights.alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-destructive mb-1 last:mb-0">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          )}

          {/* Toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
            data-testid="weather-expand-toggle"
          >
            <span className="text-sm font-medium" style={{ fontFamily: "Outfit" }}>Travel Insights & Packing List</span>
            {expanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
          </button>

          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="px-6 pb-6"
            >
              {/* Smart Insights */}
              {insights.insights.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs uppercase tracking-[0.15em] font-medium text-accent mb-3">Smart Insights</p>
                  <div className="space-y-2">
                    {insights.insights.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Lightbulb size={13} className="text-accent shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Packing Suggestions */}
              {packing.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] font-medium text-accent mb-3">Packing Suggestions</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {packing.map((item, i) => (
                      <div key={i} className="flex items-start gap-2.5 bg-muted/30 rounded-xl px-3 py-2.5 border border-border/30">
                        <Backpack size={13} className="text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium leading-tight">{item.item}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{item.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
