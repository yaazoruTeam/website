export interface MapLocation {
    lat: number;
    lng: number;
}

export interface MapMarker extends MapLocation {
    title?: string;
    description?: string;
}
