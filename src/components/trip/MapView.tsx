"use client";

import { useRef, useEffect, useState } from "react";
import { MAPBOX_TOKEN } from "@/config/constants";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  type: "hotel" | "flight" | "transfer" | "activity";
  price?: string;
}

interface MapViewProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
}

const markerColors: Record<string, string> = {
  hotel: "#111827",
  flight: "#2563eb",
  transfer: "#d97706",
  activity: "#059669",
};

export function MapView({ markers, center, zoom = 12 }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    let cancelled = false;

    async function initMap() {
      const mapboxgl = (await import("mapbox-gl")).default;

      if (cancelled || !containerRef.current) return;

      mapboxgl.accessToken = MAPBOX_TOKEN;

      const defaultCenter = center || (markers.length > 0
        ? { lat: markers[0].lat, lng: markers[0].lng }
        : { lat: 25.2048, lng: 55.2708 }); // Dubai fallback

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [defaultCenter.lng, defaultCenter.lat],
        zoom,
        attributionControl: false,
      });

      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

      mapRef.current = map;

      map.on("load", () => {
        if (cancelled) return;
        setLoaded(true);

        // Add markers
        for (const marker of markers) {
          const color = markerColors[marker.type] || "#111827";

          const popup = new mapboxgl.Popup({
            offset: 25,
            closeButton: false,
            maxWidth: "200px",
          }).setHTML(
            `<div style="font-family:Inter,sans-serif;font-size:13px;">
              <strong>${marker.label}</strong>
              ${marker.price ? `<br/><span style="font-family:JetBrains Mono,monospace;font-size:12px;">${marker.price}</span>` : ""}
            </div>`
          );

          new mapboxgl.Marker({ color, scale: 0.8 })
            .setLngLat([marker.lng, marker.lat])
            .setPopup(popup)
            .addTo(map);
        }

        // Fit bounds if multiple markers
        if (markers.length > 1) {
          const bounds = new mapboxgl.LngLatBounds();
          markers.forEach((m) => bounds.extend([m.lng, m.lat]));
          map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
        }
      });
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [markers, center, zoom]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px]" />
  );
}
