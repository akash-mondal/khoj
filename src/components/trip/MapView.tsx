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

const markerIcons: Record<string, string> = {
  hotel: "🏨",
  flight: "✈️",
  transfer: "🚗",
  activity: "📍",
};

function createCustomMarker(marker: MapMarker): HTMLElement {
  const el = document.createElement("div");
  const color = markerColors[marker.type] || "#111827";
  const icon = markerIcons[marker.type] || "📍";

  el.innerHTML = `
    <div style="
      display:flex;flex-direction:column;align-items:center;cursor:pointer;
      filter:drop-shadow(0 2px 4px rgba(0,0,0,0.15));
    ">
      <div style="
        background:${color};color:white;border-radius:12px;padding:4px 8px;
        font-size:12px;font-family:Inter,sans-serif;font-weight:500;
        display:flex;align-items:center;gap:4px;white-space:nowrap;
        border:2px solid white;
      ">
        <span style="font-size:11px">${icon}</span>
        <span>${marker.label.length > 18 ? marker.label.slice(0, 18) + "…" : marker.label}</span>
        ${marker.price ? `<span style="font-family:'JetBrains Mono',monospace;font-size:10px;opacity:0.85;margin-left:2px">${marker.price}</span>` : ""}
      </div>
      <div style="
        width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;
        border-top:6px solid ${color};margin-top:-1px;
      "></div>
    </div>
  `;
  return el;
}

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
        : { lat: 25.2048, lng: 55.2708 });

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [defaultCenter.lng, defaultCenter.lat],
        zoom: markers.length > 0 ? 10 : zoom,
        attributionControl: false,
        pitch: 30,
      });

      map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");

      mapRef.current = map;

      map.on("load", () => {
        if (cancelled) return;
        setLoaded(true);

        // Add custom markers with styled labels
        for (const marker of markers) {
          const el = createCustomMarker(marker);

          const popup = new mapboxgl.Popup({
            offset: 30,
            closeButton: false,
            maxWidth: "220px",
            className: "khoj-popup",
          }).setHTML(
            `<div style="font-family:Inter,sans-serif;padding:4px 0;">
              <div style="font-size:13px;font-weight:600;color:#111827;margin-bottom:2px;">${marker.label}</div>
              <div style="font-size:11px;color:#6b7280;text-transform:capitalize;">${marker.type}</div>
              ${marker.price ? `<div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:#111827;margin-top:4px;font-weight:500;">${marker.price}</div>` : ""}
            </div>`
          );

          new mapboxgl.Marker({ element: el, anchor: "bottom" })
            .setLngLat([marker.lng, marker.lat])
            .setPopup(popup)
            .addTo(map);
        }

        // Draw route line connecting markers in order
        if (markers.length > 1) {
          const coordinates = markers.map((m) => [m.lng, m.lat]);

          map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates,
              },
            },
          });

          // Dashed route outline
          map.addLayer({
            id: "route-outline",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#111827",
              "line-width": 3,
              "line-opacity": 0.12,
            },
          });

          // Animated dashed route line
          map.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#111827",
              "line-width": 2,
              "line-dasharray": [2, 3],
              "line-opacity": 0.5,
            },
          });

          // Add numbered circle markers at each stop
          markers.forEach((m, i) => {
            const circleEl = document.createElement("div");
            circleEl.innerHTML = `
              <div style="
                width:20px;height:20px;border-radius:50%;
                background:#111827;color:white;font-size:10px;
                font-family:Inter,sans-serif;font-weight:600;
                display:flex;align-items:center;justify-content:center;
                border:2px solid white;
                box-shadow:0 1px 3px rgba(0,0,0,0.2);
              ">${i + 1}</div>
            `;
            new mapboxgl.Marker({ element: circleEl, anchor: "center" })
              .setLngLat([m.lng, m.lat])
              .addTo(map);
          });

          // Fit bounds with padding
          const bounds = new mapboxgl.LngLatBounds();
          markers.forEach((m) => bounds.extend([m.lng, m.lat]));
          map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 0 });

          // Animated fly-to after initial render
          setTimeout(() => {
            if (cancelled || !mapRef.current) return;
            map.fitBounds(bounds, {
              padding: 60,
              maxZoom: 14,
              duration: 1500,
              pitch: 35,
            });
          }, 300);
        } else if (center) {
          // Single center point — fly to with animation
          setTimeout(() => {
            if (cancelled || !mapRef.current) return;
            map.flyTo({
              center: [center.lng, center.lat],
              zoom: 12,
              pitch: 30,
              duration: 1500,
              essential: true,
            });
          }, 300);
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
    <div className="relative w-full h-full min-h-[300px]">
      <div ref={containerRef} className="w-full h-full" />
      {/* Map legend */}
      {loaded && markers.length > 0 && (
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg border border-border px-3 py-2 shadow-sm">
          <p className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider mb-1.5">
            Trip Route
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {Object.entries(markerColors)
              .filter(([type]) => markers.some((m) => m.type === type))
              .map(([type, color]) => (
                <div key={type} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[10px] text-text-secondary capitalize">
                    {type}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
