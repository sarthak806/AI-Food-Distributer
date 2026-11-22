import { useEffect, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Loader2, LocateFixed, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";

const INDIA_CENTER: [number, number] = [20.5937, 78.9629];
const GEOAPIFY_URL = "https://api.geoapify.com/v1/geocode";
const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
const MAP_TILE_URL = GEOAPIFY_API_KEY
  ? `https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${encodeURIComponent(GEOAPIFY_API_KEY)}`
  : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const isValidCoordinate = (latitude: number, longitude: number) =>
  Number.isFinite(latitude) &&
  Number.isFinite(longitude) &&
  latitude >= 6 &&
  latitude <= 37 &&
  longitude >= 68 &&
  longitude <= 98;

export interface PickupLocationDetails {
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

interface PickupLocationPickerProps {
  value: PickupLocationDetails | null;
  onChange: (location: PickupLocationDetails) => void;
  onError: (message: string) => void;
}

interface SearchResult {
  properties: {
    place_id: string;
    formatted: string;
    lat: number;
    lon: number;
    address_line1?: string;
    address_line2?: string;
    suburb?: string;
    neighbourhood?: string;
    street?: string;
    city?: string;
    state?: string;
    postcode?: string;
  };
}

const pickupIcon = L.divIcon({
  className: "",
  html: '<div style="width:34px;height:34px;border-radius:50% 50% 50% 0;background:#17633b;border:3px solid white;box-shadow:0 2px 8px #0005;transform:rotate(-45deg);display:grid;place-items:center"><span style="width:9px;height:9px;background:white;border-radius:50%;display:block"></span></div>',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

function MapViewport({ position }: { position: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) map.flyTo(position, 17, { duration: 0.6 });
  }, [map, position]);

  return null;
}

function MapClickHandler({
  onSelect,
}: {
  onSelect: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    click: (event) => onSelect(event.latlng.lat, event.latlng.lng),
  });
  return null;
}

function addressPart(address: Record<string, string | number | undefined>, keys: string[]) {
  return keys.map((key) => address[key]).find((part): part is string => typeof part === "string" && part.length > 0) || "";
}

function resultToDetails(result: SearchResult, latitude: number, longitude: number): PickupLocationDetails {
  const address = result.properties;
  return {
    address: address.formatted,
    area: addressPart(address, ["suburb", "neighbourhood", "street"]),
    city: address.city || "",
    state: address.state || "",
    pincode: address.postcode || "",
    latitude,
    longitude,
    placeId: address.place_id,
  };
}

export default function PickupLocationPicker({
  value,
  onChange,
  onError,
}: PickupLocationPickerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);

  const selectedPosition: [number, number] | null = value && isValidCoordinate(value.latitude, value.longitude)
    ? [value.latitude, value.longitude]
    : null;

  const reverseGeocode = async (latitude: number, longitude: number) => {
    if (!isValidCoordinate(latitude, longitude)) {
      onError("Choose a pickup point within India.");
      return;
    }
    if (!GEOAPIFY_API_KEY) {
      onError("Geoapify is not configured. Add VITE_GEOAPIFY_API_KEY to Frontend/.env and restart the frontend.");
      return;
    }
    setIsResolving(true);
    try {
      const response = await fetch(
        `${GEOAPIFY_URL}/reverse?lat=${latitude}&lon=${longitude}&apiKey=${encodeURIComponent(GEOAPIFY_API_KEY)}`,
      );
      if (!response.ok) throw new Error(`Reverse geocoding failed: ${response.status}`);
      const responseData = await response.json() as { features?: SearchResult[] };
      const result = responseData.features?.[0];
      if (!result) throw new Error("No address found for this location");
      onChange(resultToDetails(result, latitude, longitude));
    } catch (error) {
      console.error("Pickup reverse geocoding failed:", error);
      onError("We could not identify this pickup point. Try another location.");
    } finally {
      setIsResolving(false);
    }
  };

  const searchLocations = async () => {
    if (!query.trim()) return;
    if (!GEOAPIFY_API_KEY) {
      onError("Geoapify is not configured. Add VITE_GEOAPIFY_API_KEY to Frontend/.env and restart the frontend.");
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(
        `${GEOAPIFY_URL}/autocomplete?text=${encodeURIComponent(`${query.trim()}, India`)}&filter=countrycode:in&limit=5&apiKey=${encodeURIComponent(GEOAPIFY_API_KEY)}`,
      );
      if (!response.ok) throw new Error(`Search failed: ${response.status}`);
      const responseData = await response.json() as { features?: SearchResult[] };
      const matches = responseData.features || [];
      setResults(matches);
      if (matches.length === 0) {
        onError("No matching address was found. Try adding the city, district, or nearby landmark.");
      }
    } catch (error) {
      console.error("Pickup location search failed:", error);
      onError("Location search is temporarily unavailable. Try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      onError("Location services are not supported by this browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position: [number, number] = [coords.latitude, coords.longitude];
        setCurrentLocation(position);
        void reverseGeocode(coords.latitude, coords.longitude);
        setIsLocating(false);
      },
      (error) => {
        console.error("Current location permission failed:", error);
        onError(error.code === error.PERMISSION_DENIED
          ? "Location permission was denied. Search for the pickup destination instead."
          : "Your current location could not be detected. Try searching for the pickup destination.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    );
  };

  const selectSearchResult = (result: SearchResult) => {
    const latitude = result.properties.lat;
    const longitude = result.properties.lon;
    if (!isValidCoordinate(latitude, longitude)) {
      onError("The search provider returned an invalid Indian location. Try a more specific address.");
      return;
    }
    setQuery(result.properties.formatted);
    setResults([]);
    onChange(resultToDetails(result, latitude, longitude));
  };

  return (
    <div className="space-y-3">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-3.5 z-10 text-[#536258]" size={19} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void searchLocations();
              }
            }}
            placeholder="Search address, building, restaurant, street or landmark..."
            className="h-12 w-full rounded-xl border border-[#c9d9c9] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#17633b] focus:ring-2 focus:ring-[#17633b]/10"
          />
          {results.length > 0 && (
            <div className="absolute left-0 right-0 top-14 z-[1000] overflow-hidden rounded-xl border border-[#dce5dd] bg-white shadow-lg">
              {results.map((result) => (
                <button type="button" key={result.place_id} onClick={() => selectSearchResult(result)} className="block w-full border-b border-[#eef2ee] px-4 py-3 text-left text-sm text-[#31443a] last:border-0 hover:bg-[#eef6eb]">
                  <span className="block font-semibold">{result.properties.address_line1 || result.properties.formatted.split(",")[0]}</span>
                  <span className="mt-1 block truncate text-xs text-[#718078]">{result.properties.formatted}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <Button type="button" onClick={() => void searchLocations()} disabled={isSearching || !query.trim()} className="h-12 rounded-xl bg-[#17633b] px-5 text-white hover:bg-[#22784a]">
          {isSearching ? <Loader2 className="animate-spin" size={18} /> : "Search"}
        </Button>
      </div>

      <div className="relative z-0 overflow-hidden rounded-2xl border border-[#dce5dd]">
        <MapContainer attributionControl={false} center={selectedPosition || currentLocation || INDIA_CENTER} zoom={selectedPosition || currentLocation ? 17 : 5} scrollWheelZoom style={{ height: 380, width: "100%" }}>
          <TileLayer url={MAP_TILE_URL} />
          <MapViewport position={selectedPosition} />
          <MapClickHandler onSelect={(latitude, longitude) => void reverseGeocode(latitude, longitude)} />
          {currentLocation && <CircleMarker center={currentLocation} radius={8} pathOptions={{ color: "#2563eb", fillColor: "#60a5fa", fillOpacity: 1 }} />}
          {selectedPosition && <Marker position={selectedPosition} icon={pickupIcon} draggable eventHandlers={{ dragend: (event) => {
            const marker = event.target as L.Marker;
            const position = marker.getLatLng();
            void reverseGeocode(position.lat, position.lng);
          }}} />}
        </MapContainer>
        <div className="absolute bottom-1 left-2 z-[400] rounded bg-white/80 px-1 text-[10px] text-[#536258]">
          &copy; <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors · Geoapify
        </div>
        {isResolving && <div className="absolute left-3 top-3 z-[500] flex items-center rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#536258] shadow"><Loader2 className="mr-2 animate-spin" size={14} /> Updating address...</div>}
        <Button type="button" onClick={useCurrentLocation} disabled={isLocating} className="absolute bottom-3 right-3 z-[500] rounded-full bg-white text-[#17633b] shadow hover:bg-[#eef6eb]">
          <LocateFixed size={16} className="mr-2" /> {isLocating ? "Locating..." : "Use my location"}
        </Button>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-[#eef6eb] p-3 text-sm text-[#315d3b]">
        <MapPin className="mt-0.5 shrink-0" size={17} />
        <span>{value?.address || "Search, click the map, or drag the green pickup pin to set the collection point."}</span>
      </div>
      {value && <p className="text-xs text-[#536258]">Pickup pin: {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}{value.placeId ? ` · Place ${value.placeId}` : ""}</p>}
    </div>
  );
}
