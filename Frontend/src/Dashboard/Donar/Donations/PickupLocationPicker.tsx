import { useEffect, useMemo, useState } from "react";
import { Loader2, LocateFixed, MapPin, Search } from "lucide-react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";

const INDIA_CENTER: [number, number] = [20.5937, 78.9629];
const isValidCoordinate = (latitude: number, longitude: number) =>
  Number.isFinite(latitude) && Number.isFinite(longitude) &&
  latitude >= 6 && latitude <= 37 && longitude >= 68 && longitude <= 98;

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

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  place_id: number;
  address?: Record<string, string>;
}

const pickupIcon = L.divIcon({
  className: "pickup-location-marker",
  html: '<span style="display:block;width:24px;height:24px;border:3px solid white;border-radius:50% 50% 50% 0;background:#17633b;transform:rotate(-45deg);box-shadow:0 2px 8px #0006"></span>',
  iconSize: [30, 30],
  iconAnchor: [15, 25],
});

function toPickupDetails(result: NominatimResult): PickupLocationDetails {
  const address = result.address || {};
  const area = [address.amenity, address.shop, address.building, address.road, address.neighbourhood, address.suburb]
    .filter(Boolean).join(", ");
  return {
    address: result.display_name,
    area,
    city: address.city || address.town || address.village || address.municipality || address.county || "",
    state: address.state || "",
    pincode: address.postcode || "",
    latitude: Number(result.lat),
    longitude: Number(result.lon),
    placeId: String(result.place_id || ""),
  };
}

async function geocode(params: Record<string, string>) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Address lookup failed (${response.status})`);
  return await response.json() as NominatimResult[];
}

async function reverseGeocode(latitude: number, longitude: number) {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Address lookup failed (${response.status})`);
  return await response.json() as NominatimResult;
}

function MapCamera({ position }: { position: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 16, { duration: 0.5 });
  }, [map, position]);
  return null;
}

function MapClickHandler({ onPick }: { onPick: (latitude: number, longitude: number) => void }) {
  useMapEvents({ click: (event) => onPick(event.latlng.lat, event.latlng.lng) });
  return null;
}

export default function PickupLocationPicker({ value, onChange, onError }: PickupLocationPickerProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const position = value && isValidCoordinate(value.latitude, value.longitude)
    ? [value.latitude, value.longitude] as [number, number]
    : null;
  const mapCenter = position || INDIA_CENTER;
  const selectedPosition = useMemo(() => position, [value?.latitude, value?.longitude]);

  const pickLocation = async (latitude: number, longitude: number) => {
    if (!isValidCoordinate(latitude, longitude)) {
      onError("Choose a pickup point within India.");
      return;
    }
    setIsResolving(true);
    try {
      const result = await reverseGeocode(latitude, longitude);
      onChange({ ...toPickupDetails(result), latitude, longitude });
    } catch (error) {
      console.error("OpenStreetMap reverse geocoding failed:", error);
      onError("We could not identify this pickup point. Try another location.");
    } finally {
      setIsResolving(false);
    }
  };

  const searchLocations = async () => {
    const searchText = query.trim();
    if (!searchText) return;
    setIsSearching(true);
    try {
      const matches = await geocode({
        format: "jsonv2", addressdetails: "1", limit: "5", countrycodes: "in", q: searchText,
      });
      const match = matches.find((item) => isValidCoordinate(Number(item.lat), Number(item.lon)));
      if (!match) {
        onError("No matching address was found in India. Try adding the city or nearby landmark.");
        return;
      }
      const details = toPickupDetails(match);
      setQuery(details.address);
      onChange(details);
    } catch (error) {
      console.error("OpenStreetMap location search failed:", error);
      onError("Location search is temporarily unavailable. You can still click the map to choose a point.");
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
      ({ coords }) => { void pickLocation(coords.latitude, coords.longitude); setIsLocating(false); },
      (error) => {
        onError(error.code === error.PERMISSION_DENIED
          ? "Location permission was denied. Search for the pickup destination instead."
          : "Your current location could not be detected. Try searching for the pickup destination.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    );
  };

  return (
    <div className="space-y-3">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-3.5 z-10 text-[#536258]" size={19} />
          <input
            type="search" value={query} onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void searchLocations(); } }}
            placeholder="Search address, building, restaurant, street or landmark..."
            className="h-12 w-full rounded-xl border border-[#c9d9c9] bg-white pl-11 pr-4 text-sm outline-none focus:border-[#17633b] focus:ring-2 focus:ring-[#17633b]/10"
          />
        </div>
        <Button type="button" onClick={() => void searchLocations()} disabled={isSearching || !query.trim()} className="h-12 rounded-xl bg-[#17633b] px-5 text-white hover:bg-[#22784a]">
          {isSearching ? <Loader2 className="animate-spin" size={18} /> : "Search"}
        </Button>
      </div>

      <div className="relative z-0 overflow-hidden rounded-2xl border border-[#dce5dd]">
        <MapContainer center={mapCenter} zoom={position ? 16 : 5} scrollWheelZoom style={{ height: 380, width: "100%" }}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapCamera position={selectedPosition} />
          <MapClickHandler onPick={(lat, lng) => void pickLocation(lat, lng)} />
          {position && <Marker position={position} icon={pickupIcon} draggable eventHandlers={{ dragend: (event) => {
            const point = event.target.getLatLng();
            void pickLocation(point.lat, point.lng);
          } }} />}
        </MapContainer>
        {isResolving && <div className="absolute left-3 top-3 z-[500] flex items-center rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#536258] shadow"><Loader2 className="mr-2 animate-spin" size={14} /> Updating address...</div>}
        <Button type="button" onClick={useCurrentLocation} disabled={isLocating} className="absolute bottom-3 right-3 z-[500] rounded-full bg-white text-[#17633b] shadow hover:bg-[#eef6eb]">
          <LocateFixed size={16} className="mr-2" /> {isLocating ? "Locating..." : "Use my location"}
        </Button>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-[#eef6eb] p-3 text-sm text-[#315d3b]">
        <MapPin className="mt-0.5 shrink-0" size={17} />
        <span>{value?.address || "Search, click the map, or drag the pickup pin to set the collection point."}</span>
      </div>
      {value && <p className="text-xs text-[#536258]">Pickup pin: {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}</p>}
    </div>
  );
}
