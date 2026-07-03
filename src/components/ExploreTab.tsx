import React, { useState, useMemo } from "react";
import { Place } from "../types";
import { CURATED_PLACES, formatCurrency } from "../utils";
import { TRANSLATIONS, Language, CURRENCIES } from "../translations";
import { 
  Search, 
  MapPin, 
  Star, 
  SlidersHorizontal, 
  TrendingUp, 
  Clock, 
  Navigation, 
  CheckCircle2, 
  Map, 
  Phone, 
  Coffee, 
  Building2, 
  DollarSign, 
  Tag,
  Compass
} from "lucide-react";

interface ExploreTabProps {
  onAddTripDestination?: (destinationName: string) => void;
  onAskAIAboutPlace?: (placeName: string) => void;
  language: string;
  currency: string;
}

export default function ExploreTab({ onAddTripDestination, onAskAIAboutPlace, language, currency }: ExploreTabProps) {
  const lang = (language as Language) || "English";
  const t = (key: string, fallback?: string) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS["English"]?.[key] || fallback || key;
  };

  const getCurrencySymbol = (code: string) => {
    const found = CURRENCIES.find(c => c.code === code);
    return found ? found.symbol : "$";
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  
  // Advanced filters state
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [onlyOpenNow, setOnlyOpenNow] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Categories list
  const categories = ["All", "Restaurants", "Hotels", "Shopping", "Events", "ATMs", "Fuel", "Hospitals"];

  // Recently searched & trending places
  const recentSearches = ["Kyoto Cafe", "Aman Resort", "Gion Festival", "Emergency Clinic"];
  const trendingSearches = [
    { name: "Arashiyama Bamboo Grove", type: "Attraction" },
    { name: "Traditional Gion Gyoza", type: "Food" },
    { name: "Kinkaku-ji Golden Pavilion", type: "Culture" }
  ];

  // Filtering places
  const filteredPlaces = useMemo(() => {
    return CURATED_PLACES.filter(place => {
      // 1. Search text matches name, address or description
      const matchesSearch = searchQuery === "" || 
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Category filter
      const matchesCategory = activeCategory === "All" || place.category === activeCategory;
      
      // 3. Minimum rating filter
      const matchesRating = minRating === null || place.rating >= minRating;
      
      // 4. Maximum distance filter (in km)
      const matchesDistance = maxDistance === null || place.distance <= maxDistance;
      
      // 5. Maximum price filter (1-4)
      const matchesPrice = maxPrice === null || place.priceLevel <= maxPrice;
      
      // 6. Open Status
      const matchesOpen = !onlyOpenNow || place.openNow;

      return matchesSearch && matchesCategory && matchesRating && matchesDistance && matchesPrice && matchesOpen;
    });
  }, [searchQuery, activeCategory, minRating, maxDistance, maxPrice, onlyOpenNow]);

  // Reset all filters helper
  const handleResetFilters = () => {
    setMinRating(null);
    setMaxDistance(null);
    setMaxPrice(null);
    setOnlyOpenNow(false);
    setSearchQuery("");
    setActiveCategory("All");
  };

  return (
    <div className="h-full flex flex-col overflow-hidden space-y-3.5 relative">
      {/* Universal Search and Filter Header */}
      <div className="space-y-2 shrink-0">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search coffee, hotels, local ATMs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-full py-2.5 pl-10 pr-4 text-[11px] font-bold focus:outline-none focus:ring-1 focus:ring-[#FF385C] focus:border-[#FF385C] shadow-xs"
            />
          </div>
          <button 
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`p-2.5 rounded-full border transition-all cursor-pointer ${showFiltersPanel ? "bg-[#FF385C] border-[#FF385C] text-white shadow-sm" : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 shadow-xs"}`}
            title="Toggle Smart Filters"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Smart Filters Expandable Drawer - styled like a premium airbnb card */}
        {showFiltersPanel && (
          <div className="absolute top-11 left-0 right-0 z-20 bg-white border border-neutral-200 rounded-2xl p-4 shadow-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider">Smart Filters</span>
              <button 
                onClick={handleResetFilters}
                className="text-[10px] text-neutral-400 hover:text-[#FF385C] font-extrabold"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Rating filter */}
              <div>
                <label className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">Minimum Rating</label>
                <div className="flex gap-1.5 mt-0.5">
                  {[4.0, 4.5, 4.7, 4.9].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(minRating === rating ? null : rating)}
                      className={`flex-1 py-1 rounded-lg text-[9px] font-extrabold border transition-all cursor-pointer ${minRating === rating ? "bg-neutral-900 border-neutral-900 text-white" : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"}`}
                    >
                      {rating}★+
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance filter */}
              <div>
                <label className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">Max Distance (Radius)</label>
                <div className="flex gap-1.5 mt-0.5">
                  {[1.0, 2.0, 3.0, 5.0].map(dist => (
                    <button
                      key={dist}
                      onClick={() => setMaxDistance(maxDistance === dist ? null : dist)}
                      className={`flex-1 py-1 rounded-lg text-[9px] font-extrabold border transition-all cursor-pointer ${maxDistance === dist ? "bg-neutral-900 border-neutral-900 text-white" : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"}`}
                    >
                      &lt;{dist}km
                    </button>
                  ))}
                </div>
              </div>

              {/* Price level filter */}
              <div>
                <label className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">Max Price Tier</label>
                <div className="flex gap-1.5 mt-0.5">
                  {[1, 2, 3, 4].map(tier => (
                    <button
                      key={tier}
                      onClick={() => setMaxPrice(maxPrice === tier ? null : tier)}
                      className={`flex-1 py-1 rounded-lg text-[9px] font-extrabold border transition-all cursor-pointer ${maxPrice === tier ? "bg-neutral-900 border-neutral-900 text-white" : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"}`}
                    >
                      {"$".repeat(tier)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Open status */}
              <div className="flex justify-between items-center pt-2 border-t border-neutral-100">
                <span className="text-[10px] font-bold text-neutral-600">Currently Open Only</span>
                <input 
                  type="checkbox" 
                  checked={onlyOpenNow}
                  onChange={() => setOnlyOpenNow(!onlyOpenNow)}
                  className="w-4 h-4 rounded text-[#FF385C] border-neutral-300 focus:ring-[#FF385C]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Horizontal Swipeable Categories strip */}
      <div className="overflow-x-auto no-scrollbar -mx-5 px-5 shrink-0">
        <div className="flex gap-1.5 pb-0.5">
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            const label = cat === "All" ? t("all", "All") : cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-1.5 px-3 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border cursor-pointer ${isActive ? "bg-neutral-900 text-white border-neutral-900 shadow-xs" : "bg-white text-neutral-500 border-neutral-250 hover:bg-neutral-50"}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty States Filter / Search */}
      {filteredPlaces.length === 0 && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-center space-y-2 shrink-0 my-2">
          <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center mx-auto">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-neutral-800">{t("noMatchingSpots", "No matching spots found")}</h3>
            <p className="text-[10px] text-neutral-400 mt-0.5 max-w-xs mx-auto">{t("tryClearing", "Try clearing search filters.")}</p>
          </div>
          <button 
            onClick={handleResetFilters}
            className="bg-neutral-900 text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-xs cursor-pointer"
          >
            {t("clearFilters", "Clear Filters")}
          </button>
        </div>
      )}

      {/* Horizontal Carousel of Curated Local Places */}
      <div className="overflow-x-auto no-scrollbar -mx-5 px-5 py-2 shrink-0">
        <div className="flex gap-4 pb-3">
          {filteredPlaces.map(place => (
            <div 
              key={place.id}
              onClick={() => setSelectedPlace(place)}
              className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-300 cursor-pointer group flex flex-col w-56 shrink-0"
            >
              {/* Visual Thumbnail */}
              <div className="relative h-28 w-full shrink-0 overflow-hidden bg-neutral-100">
                <img 
                  src={place.image} 
                  alt={place.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-white/95 backdrop-blur-xs text-neutral-900 text-[8px] font-black px-2 py-0.5 rounded-full shadow-xs">
                  {place.category}
                </span>
                <span className={`absolute bottom-2 right-2 text-[8px] font-bold px-1.5 py-0.5 rounded-md ${place.openNow ? "bg-emerald-500 text-white" : "bg-neutral-400 text-white"}`}>
                  {place.openNow ? t("openNow", "Open Now") : t("closed", "Closed")}
                </span>
              </div>

              {/* Content Details */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-1.5">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <h3 className="text-[11px] font-bold text-neutral-900 group-hover:text-[#FF385C] transition-colors line-clamp-1">{place.name}</h3>
                    <div className="flex items-center gap-0.5 text-amber-500 shrink-0 font-extrabold text-[9px] bg-amber-50 px-1 py-0.5 rounded">
                      <Star className="w-2.5 h-2.5 fill-amber-500" />
                      <span>{place.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-neutral-400 font-bold truncate">
                    {place.address}
                  </p>

                  <p className="text-[10px] text-neutral-500 line-clamp-2 leading-tight">
                    {place.description}
                  </p>
                </div>

                {/* Distance and Price Levels footer */}
                <div className="flex justify-between items-center pt-1.5 border-t border-neutral-100 text-[9px] font-bold text-neutral-500">
                  <span className="bg-neutral-50 px-1.5 py-0.5 rounded-md truncate">
                    {place.distance} km
                  </span>
                  <span className="bg-[#FF385C]/5 text-[#FF385C] px-1.5 py-0.5 rounded-md">
                    {getCurrencySymbol(currency).repeat(place.priceLevel)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended searches and Trending Section - Only visible if search input is empty */}
      {searchQuery === "" && (
        <div className="flex-1 overflow-y-auto no-scrollbar border-t border-neutral-150 pt-3 space-y-3.5 pb-4">
          <div className="space-y-1.5">
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-400" /> {t("recentlySearched", "Recently Searched")}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {recentSearches.map(term => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="bg-neutral-50 hover:bg-neutral-100 text-neutral-600 text-[9px] font-bold py-1 px-2.5 rounded-full border border-neutral-150 transition-all cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold tracking-wider text-[#FF385C] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#FF385C]" /> {t("trendingIn", "Trending in Kyoto")}
            </h4>
            <div className="space-y-1.5">
              {trendingSearches.map((trend, i) => (
                <div 
                  key={i}
                  onClick={() => setSearchQuery(trend.name)}
                  className="flex justify-between items-center py-1.5 px-2.5 hover:bg-neutral-50 rounded-xl cursor-pointer transition-all border border-transparent hover:border-neutral-150"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-neutral-400">0{i + 1}</span>
                    <span className="text-[10px] font-bold text-neutral-800">{trend.name}</span>
                  </div>
                  <span className="text-[8px] font-black text-[#FF385C] bg-[#FF385C]/5 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {trend.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Place Detail Overlay / Bottom Sheet Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 bg-neutral-900/60 z-50 flex items-end justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-5 duration-300">
            {/* Cover Image */}
            <div className="relative h-48 w-full bg-neutral-100 shrink-0">
              <img src={selectedPlace.image} alt={selectedPlace.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedPlace(null)}
                className="absolute top-4 right-4 bg-white/95 text-neutral-800 w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-md hover:bg-neutral-100 cursor-pointer"
              >
                ✕
              </button>
              <span className="absolute bottom-4 left-4 bg-[#FF385C] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                {selectedPlace.category}
              </span>
            </div>
            {/* Scrollable details */}
            <div className="p-5 overflow-y-auto space-y-4">
              <div>
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-extrabold text-neutral-900 leading-tight">{selectedPlace.name}</h2>
                  <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-lg">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{selectedPlace.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-400 font-medium flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" /> {selectedPlace.address}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs text-neutral-600 border-y border-neutral-100 py-3 bg-neutral-50 px-3 rounded-2xl">
                <span className="flex items-center gap-1 font-semibold">
                  <Navigation className="w-4 h-4 text-neutral-400" /> {selectedPlace.distance} km
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <Clock className="w-4 h-4 text-emerald-500" /> {selectedPlace.openNow ? t("openNow", "Open Now") : t("closed", "Closed")}
                </span>
                <span className="font-bold text-[#FF385C]">
                  {getCurrencySymbol(currency).repeat(selectedPlace.priceLevel)}
                </span>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">{t("aboutThisSpot", "About this spot")}</h4>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {selectedPlace.description}
                </p>
              </div>

              {/* Actions bar inside Detail sheet */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                {onAddTripDestination && (
                  <button 
                    onClick={() => {
                      onAddTripDestination(selectedPlace.name);
                      setSelectedPlace(null);
                    }}
                    className="bg-[#FF385C] hover:bg-rose-600 text-white rounded-full py-3 text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Compass className="w-4 h-4" /> {t("addToTripPlan", "Add to Trip Plan")}
                  </button>
                )}
                {onAskAIAboutPlace && (
                  <button 
                    onClick={() => {
                      onAskAIAboutPlace(selectedPlace.name);
                      setSelectedPlace(null);
                    }}
                    className="bg-neutral-900 hover:bg-neutral-850 text-white rounded-full py-3 text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Coffee className="w-4 h-4" /> {t("askIrisInfo", "Ask Iris Info")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
