/// <reference types="google.maps" />
import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Box } from '@mui/material';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { colors } from '../../styles/theme';
import { useTranslation } from 'react-i18next';

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
    title
}) => {
    const { t } = useTranslation();
    const defaultTitle = title || t('mapLocation');
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markerRef = useRef<google.maps.Marker | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [mapReady, setMapReady] = useState<boolean>(false);

    // Reset state when modal closes
    useEffect(() => {
        if (!open) {
            setLoading(true);
            setError(null);
            setMapReady(false);
        }
    }, [open]);

    // Initialize map only when modal is open AND DOM is ready
    useEffect(() => {
        if (!open || !mapReady) {
            console.log('⏸️ Waiting for modal to be ready', { open, mapReady });
            return;
        }

        console.log('🚀 Modal is ready, starting map initialization');

        const initMap = () => {
            try {
            
                if (!mapRef.current) {
                    console.error('❌ mapRef.current is still null!');
                    throw new Error(t('errorLoadingMap'));
                }

                console.log('🌍 Checking if google exists:', typeof google);
                
                // Check if google is available
                if (typeof google === 'undefined' || !google.maps) {
                    console.error('❌ Google Maps API not loaded');
                    throw new Error(t('errorLoadingMap'));
                }
                
                console.log('✅ Google Maps API is loaded');

                const position = { lat, lng };

                // Create the map with basic options
                const map = new google.maps.Map(mapRef.current, {
                    center: position,
                    zoom: 15,
                    mapTypeControl: true,
                    streetViewControl: true,
                    fullscreenControl: true,
                });

                mapInstanceRef.current = map;
                console.log('✅ Map created successfully');

                // Create a standard marker
                const marker = new google.maps.Marker({
                    map: map,
                    position: position,
                    title: defaultTitle,
                    animation: google.maps.Animation.DROP,
                });

                markerRef.current = marker;
                console.log('✅ Marker created successfully');
                
                setError(null);
                setLoading(false);
            } catch (error) {
                console.error('❌ Error initializing map:', error);
                const errorMessage = error instanceof Error ? error.message : t('errorLoadingMap');
                setError(errorMessage);
                setLoading(false);
            }
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            console.log('⏰ Timeout completed, calling initMap');
            initMap();
        }, 100);

        return () => {
            clearTimeout(timer);
            if (markerRef.current) {
                markerRef.current.setMap(null);
            }
            mapInstanceRef.current = null;
        };
    }, [open, mapReady, lat, lng, defaultTitle, t]);

    // Callback when Dialog is fully rendered
    const handleTransitionEntered = () => {
        console.log('✅ Dialog transition complete, DOM is ready');
        setMapReady(true);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            TransitionProps={{
                onEntered: handleTransitionEntered
            }}
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
                    {defaultTitle}
                </Box>
                <IconButton onClick={onClose} size="small">
                    <XMarkIcon style={{ width: 24, height: 24 }} />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0, height: '500px', position: 'relative' }}>
                {/* Map div - always rendered but hidden when showing loading/error */}
                <div 
                    ref={mapRef} 
                    style={{ 
                        width: '100%', 
                        height: '100%',
                        display: (error || loading) ? 'none' : 'block'
                    }} 
                />
                
                {/* Loading overlay */}
                {loading && !error && (
                    <Box sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        backgroundColor: 'white',
                        zIndex: 10
                    }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ fontSize: '16px', mb: 1 }}>⏳</Box>
                            <Box>{t('loadingMap')}</Box>
                        </Box>
                    </Box>
                )}
                
                {/* Error overlay */}
                {error && (
                    <Box sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center',
                        backgroundColor: 'white',
                        color: colors.red500,
                        padding: 3,
                        textAlign: 'center',
                        zIndex: 10
                    }}>
                        <Box sx={{ fontSize: '18px', fontWeight: 600, mb: 1 }}>
                            ❌ {t('errorLoadingMap')}
                        </Box>
                        <Box sx={{ fontSize: '14px' }}>
                            {error}
                        </Box>
                        <Box sx={{ fontSize: '12px', mt: 2, color: colors.blue700 }}>
                            {t('checkConsoleForDetails')}
                        </Box>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default MapLocationModal;
