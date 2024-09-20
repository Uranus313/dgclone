'use client'
import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style';
import Geolocation from 'ol/Geolocation';
import { fromLonLat } from 'ol/proj';
import Overlay from 'ol/Overlay';

interface Props{
    warehousLocs:{coordinates:number[] , desc:string , openTime:string , id:string,title:string}[]
}

const MapComponent = ({warehousLocs}:Props) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const viewRef = useRef<View | null>(null);
  const positionFeatureRef = useRef<Feature | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [selectedWareHouse,setSelectedWareHouse]= useState<{ coordinates: number[];title:string; desc: string; openTime: string; id: string; } | null>(null)

  useEffect(() => {
    if (mapInstance.current) {
      // If the map instance already exists, do nothing
      return;
    }

    const tehranCoordinates = [51.3890, 35.6892]; // Longitude, Latitude for Tehran
    const miladTowerCoordinates = [51.37528, 35.74472]; // Longitude, Latitude for Milad Tower

    const view = new View({
      center: fromLonLat(tehranCoordinates), // Use fromLonLat to convert coordinates
      zoom: 12,
    });

    viewRef.current = view;

    const map = new Map({
      target: mapRef.current!,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: view,
    });

    mapInstance.current = map; // Store the map instance

    const geolocation = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: view.getProjection(),
    });

    geolocation.setTracking(true);

    const accuracyFeature = new Feature();
    const positionFeature = new Feature();
    positionFeatureRef.current = positionFeature;
    positionFeature.setStyle(
      new Style({
        image: new CircleStyle({
          radius: 6,
          fill: new Fill({ color: '#3399CC' }),
          stroke: new Stroke({ color: '#fff', width: 2 }),
        }),
      })
    );

    geolocation.on('change:position', function () {
      const coordinates = geolocation.getPosition();
      if (coordinates) {
        const point = new Point(coordinates);
        positionFeature.setGeometry(point);
        view.setCenter(coordinates);
      } else {
        positionFeature.setGeometry(undefined);
      }
    });

    const vectorSource = new VectorSource({
      features: [accuracyFeature, positionFeature],
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);

    // Add Milad Tower marker
    warehousLocs.forEach(warehouse=>{
        const feature = new Feature({
          geometry: new Point(fromLonLat(warehouse.coordinates)),
        });
        feature.setStyle(
          new Style({
            image: new Icon({
              src: 'https://openlayers.org/en/latest/examples/data/icon.png', // URL to your marker icon
              scale: 1,
            }),
          })
        );
        feature.setId(warehouse.id)
        vectorSource.addFeature(feature);

    })
    


    // Create an overlay to anchor the popup to the map
    const popup = new Overlay({
      element: popupRef.current!,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -20], // Adjusted offset
      autoPan: true, // Enable autoPan
    });
    map.addOverlay(popup);

    // Display popup on click
    map.on('click', function (evt) {
        const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
          return feature;
        });
      
        if (feature) {
          const warehouseId = feature.getId();
          const selectedWarehouse = warehousLocs.find(warehouse => warehouse.id === warehouseId);
          console.log(selectedWarehouse)
          if (selectedWarehouse) {
            setSelectedWareHouse(selectedWarehouse);
          }
        }
      });
      
  }, []);

  const handleLocateMe = () => {
    const geolocation = new Geolocation({
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: viewRef.current!.getProjection(),
    });

    geolocation.setTracking(true);

    geolocation.once('change:position', function () {
      const coordinates = geolocation.getPosition();
      if (coordinates) {
        viewRef.current!.setCenter(coordinates);
      }
    });
  };

  return (
    <div className='grid grid-cols-4'>
      <div  className='col-span-1 pl-4'>
        <div className='p-2 border-b border-grey-border'>
            <p className='font-bold my-2'>نام انبار</p>
            <p>{selectedWareHouse?.title}</p>
        </div>
        <div className='p-2 border-b border-grey-border '>
            <p className='font-bold my-2'>روز های کاری:</p>
            <p>{selectedWareHouse?.openTime}</p>
        </div>
        <div className='p-2 border-b border-grey-border '>
            <p className='font-bold my-2'>اطلاعات بیشتر</p>
            <p>{selectedWareHouse?.desc}</p>
        </div>

      </div>
      <div className='col-span-3' ref={mapRef} style={{ width: '100%', height: '400px' }} />
      {/* <button onClick={handleLocateMe}>Locate Me</button> */}
    </div>
  );
};

export default MapComponent;
