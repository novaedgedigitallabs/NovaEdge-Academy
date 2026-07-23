"use client";

import { useState, useEffect, useRef } from "react";
import { apiGet } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, X, Clock, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const POPULAR_CITIES = [
  { city: "Bhopal", state: "Madhya Pradesh", country: "India", iso2: "IN" },
  { city: "New Delhi", state: "Delhi", country: "India", iso2: "IN" },
  { city: "Mumbai", state: "Maharashtra", country: "India", iso2: "IN" },
  { city: "Bengaluru", state: "Karnataka", country: "India", iso2: "IN" },
  { city: "London", state: "England", country: "United Kingdom", iso2: "GB" },
  { city: "San Francisco", state: "California", country: "United States", iso2: "US" },
];

export default function CityPicker({ selectedValue, onSelectCity, placeholder = "Search city or location...", className }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (selectedValue) {
      if (typeof selectedValue === "string") {
        setQuery(selectedValue);
      } else if (selectedValue.formatted || selectedValue.city) {
        setQuery(selectedValue.formatted || `${selectedValue.city}${selectedValue.country ? `, ${selectedValue.country}` : ""}`);
      }
    }
  }, [selectedValue]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCities = async (text) => {
    if (!text || text.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await apiGet(`/api/v1/city/search?q=${encodeURIComponent(text.trim())}&limit=8`);
      if (data && data.success && Array.isArray(data.results)) {
        setResults(data.results);
        setIsOpen(data.results.length > 0);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    } catch (err) {
      console.error("CityKit API search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setQuery(text);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!text || text.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchCities(text);
    }, 200);
  };

  const handleSelect = (item) => {
    const formatted = `${item.city_ascii || item.city}${item.admin_name ? `, ${item.admin_name}` : ""}, ${item.country || "India"}`;
    setQuery(formatted);
    setIsOpen(false);

    const cityData = {
      city: item.city_ascii || item.city,
      state: item.admin_name || "",
      country: item.country || "",
      countryCode: item.iso2 || "",
      timezone: item.timezone ? `UTC${item.timezone >= 0 ? "+" : ""}${item.timezone}` : "",
      lat: item.lat || null,
      lng: item.lng || null,
      formatted,
    };

    if (onSelectCity) {
      onSelectCity(cityData);
    }
  };

  const handleQuickChip = (cityName) => {
    setQuery(cityName);
    fetchCities(cityName);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    if (onSelectCity) {
      onSelectCity(null);
    }
  };

  return (
    <div ref={dropdownRef} className={cn("relative w-full", className)}>
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 w-4 h-4 text-primary shrink-0 pointer-events-none" />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim().length >= 2 && results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="pl-9 pr-8 text-xs bg-secondary/30 border-border focus-visible:ring-primary/20 rounded-xl"
        />
        {loading ? (
          <Loader2 className="absolute right-2.5 w-3.5 h-3.5 animate-spin text-primary shrink-0 pointer-events-none" />
        ) : query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>

      {/* Quick Chips if empty */}
      {!query && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-primary" /> Popular:
          </span>
          {POPULAR_CITIES.map((c) => (
            <button
              key={c.city}
              type="button"
              onClick={() => handleQuickChip(c.city)}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/50 hover:bg-primary/10 hover:text-primary border border-border/50 transition-colors"
            >
              {c.city}
            </button>
          ))}
        </div>
      )}

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-border/40">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground bg-muted/30 flex items-center justify-between">
            <span>CityKit Verified Locations</span>
            <span className="text-primary font-bold">{results.length} matches</span>
          </div>

          {results.map((res, idx) => (
            <div
              key={res.id || idx}
              onClick={() => handleSelect(res)}
              className="p-2.5 hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {res.iso2 || "📍"}
                </div>
                <div className="overflow-hidden">
                  <p className="font-semibold text-foreground truncate text-xs">
                    {res.city_ascii || res.city}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {res.admin_name ? `${res.admin_name}, ` : ""}{res.country}
                  </p>
                </div>
              </div>

              {res.timezone !== undefined && (
                <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full border border-border/40 shrink-0">
                  <Clock className="w-3 h-3 text-primary" />
                  <span>UTC {res.timezone >= 0 ? `+${res.timezone}` : res.timezone}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
