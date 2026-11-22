import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Loader2, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface MapComponentProps {
  origin: string;
  destination: string;
}

type Coordinates = [number, number];

const markerIcon = L.divIcon({
  className: "",
  html: '<div style="width:30px;height:30px;border-radius:50% 50% 50% 0;background:#17633b;border:3px solid white;box-shadow:0 2px 8px #0005;transform:rotate(-45deg)"></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function FitRoute({ points }: { points: Coordinates[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) map.fitBounds(points, { padding: [30, 30] });
  }, [map, points]);
  return null;
}

async function findCoordinates(address: string): Promise<Coordinates> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(address)}`,
    { headers: { Accept: "application/json" } },
  );
  if (!response.ok) throw new Error(`Could not find ${address}`);
  const results = await response.json() as Array<{ lat: string; lon: string }>;
  if (!results[0]) throw new Error(`Could not find ${address}`);
  return [Number(results[0].lat), Number(results[0].lon)];
}

export default function MapComponent({ origin, destination }: MapComponentProps) {
  const [points, setPoints] = useState<Coordinates[]>([]);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const loadRoute = async () => {
      try {
        setError("");
        const [start, end] = await Promise.all([
          findCoordinates(origin),
          findCoordinates(destination),
        ]);
        if (!active) return;
        const routeResponse = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`,
        );
        if (!routeResponse.ok) throw new Error("Route service unavailable");
        const routeData = await routeResponse.json() as {
          routes?: Array<{ distance: number; duration: number; geometry: { coordinates: [number, number][] } }>;
        };
        const route = routeData.routes?.[0];
        if (!route) throw new Error("No route found");
        setPoints(route.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude]));
        setDistance(`${(route.distance / 1000).toFixed(1)} km`);
        setDuration(`${Math.round(route.duration / 60)} min`);
      } catch (routeError) {
        console.error("OpenStreetMap route loading failed:", routeError);
        if (active) setError("Could not calculate this route. The pickup address can still be opened in a map app.");
      }
    };
    void loadRoute();
    return () => { active = false; };
  }, [origin, destination]);

  if (error) {
    return <div className="flex h-[400px] flex-col items-center justify-center rounded-xl bg-[#fff7f2] p-6 text-center text-[#8d4a36]"><MapPin size={28} /><p className="mt-3 text-sm">{error}</p></div>;
  }
  if (points.length < 2) {
    return <div className="flex h-[400px] items-center justify-center rounded-xl bg-[#f7faf5] text-[#536258]"><Loader2 className="mr-2 animate-spin" size={20} /> Loading route...</div>;
  }

  return (
    <div className="relative h-[400px] overflow-hidden rounded-xl">
      <MapContainer center={points[0]} zoom={13} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitRoute points={[points[0], points[points.length - 1]]} />
        <Marker position={points[0]} icon={markerIcon} title="NGO location" />
        <CircleMarker center={points[points.length - 1]} radius={9} pathOptions={{ color: "#dc2626", fillColor: "#f87171", fillOpacity: 1 }} />
        <Polyline positions={points} pathOptions={{ color: "#17633b", weight: 5 }} />
      </MapContainer>
      <div className="absolute bottom-4 left-4 z-[500] rounded-xl bg-white p-3 text-sm shadow">
        <p><strong>Distance:</strong> {distance}</p>
        <p><strong>Estimated drive:</strong> {duration}</p>
      </div>
    </div>
  );
}
