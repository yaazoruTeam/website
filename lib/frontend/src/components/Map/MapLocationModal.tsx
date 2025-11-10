/// <reference types="google.maps" />
import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Box } from '@mui/material';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { colors } from '../../styles/theme';

interface MapLocationModalProps {
    open: boolean;
    onClose: () => void;
    lat: number;
    lng: number;
    title?: string;
}

const MapLocationModal: React.FC<MapLocationModalProps> = ({
    open,
    onClose,
    lat,
    lng,
    title = 'מיקום במפה'
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

    useEffect(() => {
        if (!open || !mapRef.current) return;

        const initMap = async () => {
            try {
                const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
                const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

                const position = { lat, lng };

                // Create the map
                const map = new Map(mapRef.current!, {
                    center: position,
                    zoom: 15,
                    mapId: 'DEMO_MAP_ID'
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

        // Add small delay to ensure modal is fully rendered
        const timer = setTimeout(() => {
            initMap();
        }, 100);

        return () => {
            clearTimeout(timer);
            if (markerRef.current) {
                markerRef.current.map = null;
            }
        };
    }, [open, lat, lng, title]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '12px',
                    direction: 'rtl'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderBottom: `1px solid ${colors.blueOverlay700}`,
                pb: 2
            }}>
                <Box sx={{ fontSize: '20px', fontWeight: 600, color: colors.blue900 }}>
                    {title}
                </Box>
                <IconButton onClick={onClose} size="small">
                    <XMarkIcon style={{ width: 24, height: 24 }} />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0, height: '500px' }}>
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            </DialogContent>
        </Dialog>
    );
};

export default MapLocationModal;
