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
import { MapMarkersProps, Place } from '@/types/bucketListTypes';
import { sampleBucketList } from '@/lib/mock-data';

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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
      {Places.map((place: Place) => (
        <AdvancedMarker
          key={place.key}
          position={place.location}
          ref={marker => setMarkerRef(marker, place.key)}
        >
          <Pin background={pinColor} glyphColor={'#000'} borderColor={'#000'} />
        </AdvancedMarker>
      ))}
    </>
  );
}



/**
 * A component that renders a Google Map with a predefined set of locations.
 * It sets up the API provider, map controls, and initial camera position.
 * @returns A JSX element containing the configured Google Map.
 */
export function GoogleMapComponent() {

  if (!GOOGLE_API_KEY) {
    throw new Error('Google Maps API key is not defined in environment variables.');
  }

  return (
    <div className="w-full">
      <APIProvider apiKey={GOOGLE_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
          defaultZoom={13}
          defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
          mapTypeId='terrain'
          colorScheme='FOLLOW_SYSTEM'
          mapId='a1079c9cea2794a7'
          onCameraChanged={(event: MapCameraChangedEvent) =>
            console.log('camera changed:', event.detail.center, 'zoom:', event.detail.zoom)
          }>
          <MapMarkers Places={sampleBucketList} markerType='bucketList' />
        </Map>
      </APIProvider>
    </div>
  );
}


