'use client';
import { useState, useRef, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapCameraChangedEvent,
  useMap,
  Pin
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';
import { GoogleMapProps, MapMarkersProps } from '@/types/bucketListTypes';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const CHICAGO_CENTER: google.maps.LatLngLiteral = { lat: 41.8781, lng: -87.6298 };

/**
 * Renders and clusters markers on the map for a given list of places.
 * The color of the markers is determined by the `markerType` prop.
 * @param {MapMarkersProps} props The component props.
 * @param {Place[]} props.Places An array of place objects to display on the map.
 * @param {'bucketList' | 'searchResult'} props.markerType The type of marker, which dictates its appearance. Can be either 'bucketList' or 'searchResult'.
 * @returns A JSX element containing the map markers.
 */
export function MapMarkers({ Places, markerType }: MapMarkersProps) {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const pinColor = markerType === 'bucketList' ? '#ffffffff' : '#488effff';

  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  // Update markers, if the markers array has changed
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {Places.map((place: google.maps.Place, index: number) => {
        const markerKey = place.placeId || `${place.location?.lat}-${place.location?.lng}-${index}`;
        if (!place.location) return null;

        return (
          <AdvancedMarker
            key={markerKey}
            position={place.location}
            ref={marker => setMarkerRef(marker, markerKey)}
          >
            <Pin background={pinColor} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>
        );
      })}
    </>
  );
}

export function UserLocationMarker({ position }: { position: google.maps.LatLngLiteral }) {
  return (
    <AdvancedMarker position={position} className="!bg-transparent !shadow-none !border-0">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2196f34c]">
        <div className="h-3 w-3 rounded-full border-2 border-white bg-[#2196f3] shadow-[0_0_4px_#2196f3]" />
      </div>
    </AdvancedMarker>
  );
}



/**
 * A component that renders a Google Map with a predefined set of locations.
 * It sets up the API provider, map controls, and initial camera position.
 * @returns A JSX element containing the configured Google Map.
 */
export function GoogleMap({ bucketListPlaces, searchResultsPlaces, userLocation }: GoogleMapProps) {




  // Recenter the map once the browser location is available; fallback stays on Chicago.
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(CHICAGO_CENTER);
  useEffect(() => {
    if (userLocation) {
      setCenter(userLocation);
    }
  }, [userLocation]);

  if (!GOOGLE_API_KEY) {
    return (
      <div className="w-full flex items-center justify-center">
        <p className="text-red-500">Map API Key Not Found</p>
      </div>
    );
  }
  console.log(`Rendering Google Map with ${bucketListPlaces.length} bucket list places and ${(searchResultsPlaces?.length ?? 0)} search result places.`);

  return (
    <div className="w-full">
      <APIProvider apiKey={GOOGLE_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
          defaultZoom={13}
          defaultCenter={CHICAGO_CENTER}
          center={center}
          mapTypeId='terrain'
          colorScheme='FOLLOW_SYSTEM'
          mapId='a1079c9cea2794a7'
          onCameraChanged={(event: MapCameraChangedEvent) =>
            console.log('camera changed:', event.detail.center, 'zoom:', event.detail.zoom)
          }>
          {bucketListPlaces && <MapMarkers Places={bucketListPlaces} markerType='bucketList' />}
          {searchResultsPlaces && <MapMarkers Places={searchResultsPlaces} markerType='searchResult' />}
          {userLocation && <UserLocationMarker position={userLocation} />}

        </Map>
      </APIProvider>
    </div>
  );
}


