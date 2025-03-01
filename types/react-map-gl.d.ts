declare module 'react-map-gl' {
  import { ComponentType, ReactNode } from 'react';
  
  export interface MapProps {
    ref?: any;
    style?: React.CSSProperties;
    mapStyle?: string;
    mapboxAccessToken?: string;
    children?: ReactNode;
    onMove?: (evt: { viewState: any }) => void;
    [key: string]: any;
  }

  export interface ControlProps {
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  }

  export interface GeolocateControlProps extends ControlProps {
    trackUserLocation?: boolean;
    onGeolocate?: (position: any) => void;
  }

  export type MapRef = any;

  export const Map: ComponentType<MapProps>;
  export const NavigationControl: ComponentType<ControlProps>;
  export const GeolocateControl: ComponentType<GeolocateControlProps>;
} 