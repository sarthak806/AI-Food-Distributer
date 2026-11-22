import { useEffect, useRef, useState } from "react";
import { Loader2, LocateFixed, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };
const MAPPLS_API_KEY = import.meta.env.VITE_MAPPLS_API_KEY as string | undefined;
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

interface MapplsMap {
  addListener: (event: string, callback: (event?: MapClickEvent) => void) => void;
  setCenter: (position: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  panTo: (position: { lat: number; lng: number }) => void;
  remove: () => void;
}

interface MapplsMarker {
  setPosition: (position: { lat: number; lng: number }) => void;
  setDraggable: (draggable?: boolean) => void;
  addListener: (event: string, callback: (event?: unknown) => void) => void;
  remove: () => void;
  getPosition: () => { lat: number; lng: number };
}

interface MapplsApi {
  Map: new (
    containerId: string,
    options: {
      center: { lat: number; lng: number };
      zoom?: number;
    },
  ) => MapplsMap;
  Marker: new (options: {
    map: MapplsMap;
    position: { lat: number; lng: number };
    draggable?: boolean;
  }) => MapplsMarker;
}

interface MapClickEvent {
  lngLat?: { lat: number; lng: number };
  lnglat?: { lat: number; lng: number };
  latlng?: { lat: number; lng: number };
}

interface SearchResult {
  placeName?: string;
  placeAddress?: string;
  eLoc?: string;
  latitude?: number;
  longitude?: number;
  entryLatitude?: number;
  entryLongitude?: number;
  addressTokens?: {
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

interface ReverseGeocodeResult {
  pincode?: string;
  lat?: string;
  lng?: string;
  area?: string;
  city?: string;
  state?: string;
  district?: string;
  locality?: string;
  subLocality?: string;
  subSubLocality?: string;
  street?: string;
  formatted_address?: string;
  formattedAddress?: string;
  poi?: string;
  houseName?: string;
  houseNumber?: string;
}

declare global {
  interface Window {
    mappls?: MapplsApi;
  }
}

let mapplsSdkPromise: Promise<MapplsApi> | null = null;

function loadMapplsSdk(apiKey: string) {
  if (window.mappls) return Promise.resolve(window.mappls);
  if (mapplsSdkPromise) return mapplsSdkPromise;

  mapplsSdkPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>("script[data-mappls-sdk]");

    const finishLoading = () => {
      if (window.mappls) resolve(window.mappls);
      else reject(new Error("Mappls SDK did not initialize"));
    };

    if (existingScript) {
      existingScript.addEventListener("load", finishLoading, { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Mappls SDK failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.dataset.mapplsSdk = "true";
    script.src = `https://sdk.mappls.com/map/sdk/web?v=3.0&access_token=${encodeURIComponent(apiKey)}`;
    script.onload = finishLoading;
    script.onerror = () => reject(new Error("Mappls SDK failed to load"));
    document.head.appendChild(script);
  });

  return mapplsSdkPromise;
}

function addressArea(result: ReverseGeocodeResult) {
  return [result.poi, result.houseName, result.houseNumber, result.street, result.subSubLocality, result.subLocality, result.locality]
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .join(", ");
}

export default function PickupLocationPicker({
  value,
  onChange,
  onError,
}: PickupLocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapplsMap | null>(null);
  const markerRef = useRef<MapplsMarker | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(true);

  const selectedPosition = value && isValidCoordinate(value.latitude, value.longitude)
    ? { lat: value.latitude, lng: value.longitude }
    : null;

  useEffect(() => {
    if (!MAPPLS_API_KEY) {
      setIsMapLoading(false);
      onError("Mappls is not configured. Add VITE_MAPPLS_API_KEY to Frontend/.env.");
      return;
    }
    if (!mapContainerRef.current) return;

    let disposed = false;
    void loadMapplsSdk(MAPPLS_API_KEY)
      .then((mappls) => {
        if (disposed || !mapContainerRef.current) return;
        const map = new mappls.Map(mapContainerRef.current.id, {
          center: selectedPosition || INDIA_CENTER,
          zoom: selectedPosition ? 17 : 5,
        });
        mapRef.current = map;
        setIsMapLoading(false);

        map.addListener("click", (event) => {
          const position = event?.lngLat || event?.lnglat || event?.latlng;
          if (!position) return;
          void reverseGeocode(position.lat, position.lng);
        });

        if (selectedPosition) {
          markerRef.current = new mappls.Marker({
            map,
            position: selectedPosition,
            draggable: true,
          });
          markerRef.current.addListener("dragend", () => {
            const position = markerRef.current?.getPosition();
            if (position) void reverseGeocode(position.lat, position.lng);
          });
        }
      })
      .catch((error) => {
        console.error("Mappls initialization failed:", error);
        setIsMapLoading(false);
        onError("Mappls could not load. Check the browser key and domain restrictions.");
      });

    return () => {
      disposed = true;
      markerRef.current?.remove();
      mapRef.current?.remove();
      markerRef.current = null;
      mapRef.current = null;
    };
    // SDK should initialize once; subsequent position changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !selectedPosition) return;
    mapRef.current.panTo(selectedPosition);
    mapRef.current.setZoom(17);

    if (markerRef.current) {
      markerRef.current.setPosition(selectedPosition);
      markerRef.current.setDraggable(true);
    } else if (window.mappls) {
      markerRef.current = new window.mappls.Marker({
        map: mapRef.current,
        position: selectedPosition,
        draggable: true,
      });
      markerRef.current.addListener("dragend", () => {
        const position = markerRef.current?.getPosition();
        if (position) void reverseGeocode(position.lat, position.lng);
      });
    }
  }, [value?.latitude, value?.longitude]);

  const reverseGeocode = async (latitude: number, longitude: number) => {
    if (!isValidCoordinate(latitude, longitude)) {
      onError("Choose a pickup point within India.");
      return;
    }
    if (!MAPPLS_API_KEY) {
      onError("Mappls is not configured. Add VITE_MAPPLS_API_KEY to Frontend/.env.");
      return;
    }

    setIsResolving(true);
    try {
      const url = new URL("https://search.mappls.com/search/address/rev-geocode");
      url.searchParams.set("lat", String(latitude));
      url.searchParams.set("lng", String(longitude));
      url.searchParams.set("region", "IND");
      url.searchParams.set("access_token", MAPPLS_API_KEY);

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Reverse geocoding failed: ${response.status}`);
      const responseData = await response.json() as { results?: ReverseGeocodeResult[] };
      const result = responseData.results?.[0];
      if (!result) throw new Error("No address found for this location");

      const address = result.formatted_address || result.formattedAddress || addressArea(result);
      onChange({
        address,
        area: addressArea(result),
        city: result.city || result.district || result.locality || "",
        state: result.state || "",
        pincode: result.pincode || "",
        latitude,
        longitude,
        placeId: "",
      });
    } catch (error) {
      console.error("Mappls reverse geocoding failed:", error);
      onError("We could not identify this pickup point. Try another location.");
    } finally {
      setIsResolving(false);
    }
  };

  const searchLocations = async () => {
    const searchText = query.trim();
    if (!searchText) return;
    if (!MAPPLS_API_KEY) {
      onError("Mappls is not configured. Add VITE_MAPPLS_API_KEY to Frontend/.env.");
      return;
    }

    setIsSearching(true);
    try {
      const url = new URL("https://search.mappls.com/search/places/autosuggest/json");
      url.searchParams.set("query", `${searchText}, India`);
      url.searchParams.set("region", "IND");
      url.searchParams.set("location", "20.5937,78.9629");
      url.searchParams.set("access_token", MAPPLS_API_KEY);

      const response = await fetch(url);
      if (!response.ok) throw new Error(`Search failed: ${response.status}`);
      const responseData = await response.json() as {
        suggestedLocations?: SearchResult[];
      };
      const matches = responseData.suggestedLocations || [];
      setResults(matches);
      if (matches.length === 0) {
        onError("No matching address was found. Try adding the city, district, or nearby landmark.");
      }
    } catch (error) {
      console.error("Mappls location search failed:", error);
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
    const latitude = result.latitude ?? result.entryLatitude;
    const longitude = result.longitude ?? result.entryLongitude;
    if (typeof latitude !== "number" || typeof longitude !== "number" || !isValidCoordinate(latitude, longitude)) {
      onError("The search provider returned an invalid Indian location. Try a more specific address.");
      return;
    }

    setQuery(result.placeAddress || result.placeName || "");
    setResults([]);
    void reverseGeocode(latitude, longitude);
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
                <button
                  type="button"
                  key={result.eLoc || `${result.placeName}-${result.placeAddress}`}
                  onClick={() => selectSearchResult(result)}
                  className="block w-full border-b border-[#eef2ee] px-4 py-3 text-left text-sm text-[#31443a] last:border-0 hover:bg-[#eef6eb]"
                >
                  <span className="block font-semibold">{result.placeName || result.placeAddress}</span>
                  <span className="mt-1 block truncate text-xs text-[#718078]">{result.placeAddress}</span>
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
        <div id="mappls-pickup-map" ref={mapContainerRef} style={{ height: 380, width: "100%" }} />
        {isMapLoading && (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/80 text-sm font-semibold text-[#536258]">
            <Loader2 className="mr-2 animate-spin" size={18} /> Loading Mappls...
          </div>
        )}
        {isResolving && (
          <div className="absolute left-3 top-3 z-[500] flex items-center rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#536258] shadow">
            <Loader2 className="mr-2 animate-spin" size={14} /> Updating address...
          </div>
        )}
        <Button type="button" onClick={useCurrentLocation} disabled={isLocating} className="absolute bottom-3 right-3 z-[500] rounded-full bg-white text-[#17633b] shadow hover:bg-[#eef6eb]">
          <LocateFixed size={16} className="mr-2" /> {isLocating ? "Locating..." : "Use my location"}
        </Button>
        <div className="absolute bottom-1 left-2 z-[500] rounded bg-white/80 px-1 text-[10px] text-[#536258]">
          &copy; Mappls / MapmyIndia
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-xl bg-[#eef6eb] p-3 text-sm text-[#315d3b]">
        <MapPin className="mt-0.5 shrink-0" size={17} />
        <span>{value?.address || "Search, click the map, or drag the pickup pin to set the collection point."}</span>
      </div>
      {value && (
        <p className="text-xs text-[#536258]">
          Pickup pin: {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
          {value.placeId ? ` · Place ${value.placeId}` : ""}
        </p>
      )}
    </div>
  );
}
