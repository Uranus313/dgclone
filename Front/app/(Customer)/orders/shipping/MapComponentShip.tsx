import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';

interface Coordinates {
  x: string;
  y: string;
}

const MapComponentShip: React.FC<{ coordinates?: Coordinates }> = ({ coordinates }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mapRef.current && coordinates) {
      const numericCoordinates: [number, number] = [parseFloat(coordinates.x), parseFloat(coordinates.y)];
      const transformedCoordinates = fromLonLat(numericCoordinates);

      const marker = new Feature({
        geometry: new Point(transformedCoordinates),
      });

      marker.setStyle(new Style({
        image: new Icon({
          src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          anchor: [0.5, 1],
        }),
      }));

      const vectorSource = new VectorSource({
        features: [marker],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: transformedCoordinates,
          zoom: 10,
        }),
      });

      return () => map.setTarget();
    }
  }, [coordinates]);

  return <div ref={mapRef} className=' w-full min-w-32 min-h-32' > 
    {!coordinates && <p>Please provide valid coordinates.</p>}
  </div>;
};

export default MapComponentShip;
