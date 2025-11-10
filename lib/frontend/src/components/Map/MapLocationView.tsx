/// <reference types="google.maps" />
import React, { useEffect, useRef } from 'react';

interface MapLocationViewProps {
    lat: number;
    lng: number;
    zoom?: number;
    mapId?: string;
    title?: string;
    className?: string;
}

const MapLocationView: React.FC<MapLocationViewProps> = ({
    lat,
    lng,
    zoom = 14,
    mapId = 'DEMO_MAP_ID',
    title,
    className = 'w-full h-96'
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

    useEffect(() => {
        const initMap = async () => {
            if (!mapRef.current) return;

            try {
                // Request needed libraries
                const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

                const position = { lat, lng };

                // Create the map
                const map = new Map(mapRef.current, {
                    center: position,
                    zoom: zoom,
                    mapId: mapId
                });

                mapInstanceRef.current = map;

                // Create the marker
                const marker = new AdvancedMarkerElement({
                    map: map,
                    position: position,
                    title: title
                });

                markerRef.current = marker;
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        initMap();

        // Cleanup
        return () => {
            if (markerRef.current) {
                markerRef.current.map = null;
            }
            mapInstanceRef.current = null;
        };
    }, [lat, lng, zoom, mapId, title]);

    return <div ref={mapRef} className={className} />;
};

export default MapLocationView;
