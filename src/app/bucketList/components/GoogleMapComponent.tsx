'use client'; // Required for client-side components in Next.js 13+ App Router
import { APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps';

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function PlainGoogleMap() {
  if (!googleMapsApiKey) {
    throw new Error('Google Maps API key is not defined in environment variables.');
  }

  return (
    <APIProvider apiKey={googleMapsApiKey} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
        defaultZoom={13}
        defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
        }>
      </Map>
    </APIProvider>
  );
}

export function GoogleMapWithPins() {
  return <div>New Google Map Component</div>
}
