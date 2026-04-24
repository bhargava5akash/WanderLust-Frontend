import { useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Calculator, Loader2, MapPin, ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

const CHART_COLORS = ["#2C4A3B", "#2A6B7C", "#D9C8A9", "#E8E2D2"];

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "THB", "SGD", "MYR", "LKR", "NPR", "BDT"];

export default function BudgetPlannerPage() {
  const [form, setForm] = useState({
    destination: "",
    duration: 5,
    num_travelers: 2,
    travel_style: "balanced",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Currency converter state
  const [fromCurr, setFromCurr] = useState("INR");
  const [toCurr, setToCurr] = useState("USD");
  const [amount, setAmount] = useState(10000);
  const [converted, setConverted] = useState(null);
  const [converting, setConverting] = useState(false);

  const calculateBudget = async (e) => {
    e.preventDefault();
    if (!form.destination.trim()) { toast.error("Enter a destination"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/budget/calculate", form);
      setResult(data);
    } catch {
      toast.error("Failed to calculate budget");
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = async () => {
    setConverting(true);
    try {
      const { data } = await api.get(`/currency/convert?from_curr=${fromCurr}&to_curr=${toCurr}&amount=${amount}`);
      setConverted(data);
    } catch {
      toast.error("Currency conversion failed");
    } finally {
      setConverting(false);
    }
  };

  const chartData = result ? [
    { name: "Accommodation", value: result.breakdown.accommodation },
    { name: "Food", value: result.breakdown.food },
    { name: "Transport", value: result.breakdown.transport },
    { name: "Activities", value: result.breakdown.activities },
  ] : [];

  return (
    <div className="min-h-screen pt-24 pb-16" data-testid="budget-planner-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div className="mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm uppercase tracking-[0.2em] font-medium text-accent mb-3">Smart Budget</p>
          <h1 className="text-4xl sm:text-5xl tracking-tight font-light" style={{ fontFamily: "Outfit" }}>
            Budget <span className="font-medium">Planner</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-lg">Get estimated travel costs based on your destination, travel style, and trip details.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator */}
          <motion.div className="space-y-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <form onSubmit={calculateBudget} className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 space-y-5">
              <h3 className="text-lg font-medium" style={{ fontFamily: "Outfit" }}>Trip Details</h3>
              <div>
                <Label>Destination</Label>
                <div className="relative mt-1.5">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} placeholder="e.g., Goa, Manali, Kerala" className="rounded-xl pl-10" required data-testid="budget-destination-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration (days)</Label>
                  <Input type="number" min={1} max={60} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 1 }))} className="rounded-xl mt-1.5" data-testid="budget-duration-input" />
                </div>
                <div>
                  <Label>Travelers</Label>
                  <Input type="number" min={1} max={20} value={form.num_travelers} onChange={e => setForm(f => ({ ...f, num_travelers: parseInt(e.target.value) || 1 }))} className="rounded-xl mt-1.5" data-testid="budget-travelers-input" />
                </div>
              </div>
              <div>
                <Label>Travel Style</Label>
                <Select value={form.travel_style} onValueChange={v => setForm(f => ({ ...f, travel_style: v }))}>
                  <SelectTrigger className="rounded-xl mt-1.5" data-testid="budget-style-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="backpacking">Backpacking</SelectItem>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full rounded-full py-5" disabled={loading} data-testid="budget-calculate-btn">
                {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Calculator size={18} className="mr-2" />}
                Calculate Budget
              </Button>
            </form>

            {/* Currency Converter */}
            <div className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
              <h3 className="text-lg font-medium mb-5" style={{ fontFamily: "Outfit" }}>Currency Converter</h3>
              <div className="flex items-end gap-3 mb-4">
                <div className="flex-1">
                  <Label>Amount</Label>
                  <Input type="number" value={amount} onChange={e => setAmount(parseFloat(e.target.value) || 0)} className="rounded-xl mt-1.5" data-testid="currency-amount-input" />
                </div>
                <div className="flex-1">
                  <Label>From</Label>
                  <Select value={fromCurr} onValueChange={setFromCurr}>
                    <SelectTrigger className="rounded-xl mt-1.5" data-testid="currency-from-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <button onClick={() => { setFromCurr(toCurr); setToCurr(fromCurr); }} className="p-2.5 rounded-xl border border-border hover:bg-muted transition-colors mb-0.5">
                  <ArrowLeftRight size={16} className="text-muted-foreground" />
                </button>
                <div className="flex-1">
                  <Label>To</Label>
                  <Select value={toCurr} onValueChange={setToCurr}>
                    <SelectTrigger className="rounded-xl mt-1.5" data-testid="currency-to-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={convertCurrency} variant="outline" className="w-full rounded-full" disabled={converting} data-testid="currency-convert-btn">
                {converting ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                Convert
              </Button>
              {converted && (
                <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                  <p className="text-sm text-muted-foreground">{converted.amount} {converted.from} =</p>
                  <p className="text-2xl font-bold text-primary mt-1" style={{ fontFamily: "Outfit" }}>
                    {converted.converted?.toLocaleString(undefined, { maximumFractionDigits: 2 })} {converted.to}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Rate: 1 {converted.from} = {converted.rate} {converted.to}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            {!result ? (
              <div className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-12 text-center h-full flex flex-col items-center justify-center">
                <Calculator size={40} className="text-muted-foreground mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-medium mb-2" style={{ fontFamily: "Outfit" }}>Budget Breakdown</h3>
                <p className="text-sm text-muted-foreground max-w-sm">Enter your trip details to see a detailed cost estimation and expense breakdown.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Total */}
                <div className="bg-primary rounded-3xl p-8 text-primary-foreground">
                  <p className="text-sm opacity-80 mb-1">Estimated Total Budget</p>
                  <p className="text-4xl font-bold" style={{ fontFamily: "Outfit" }}>₹{result.breakdown.total.toLocaleString('en-IN')}</p>
                  <div className="flex gap-6 mt-4">
                    <div>
                      <p className="text-xs opacity-70">Per Person</p>
                      <p className="text-lg font-semibold">₹{result.breakdown.per_person.toLocaleString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">Per Day</p>
                      <p className="text-lg font-semibold">₹{result.breakdown.per_day.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                  <h3 className="text-lg font-medium mb-4" style={{ fontFamily: "Outfit" }}>Expense Breakdown</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                          {chartData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-card rounded-3xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8">
                  <h3 className="text-lg font-medium mb-4" style={{ fontFamily: "Outfit" }}>Detailed Costs</h3>
                  {["accommodation", "food", "transport", "activities"].map((cat, i) => (
                    <div key={cat} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                        <span className="text-sm capitalize">{cat}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">₹{result.breakdown[cat].toLocaleString('en-IN')}</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({Math.round((result.breakdown[cat] / result.breakdown.total) * 100)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
