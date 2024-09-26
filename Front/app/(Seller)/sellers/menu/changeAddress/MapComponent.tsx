'use client'
import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [marker, setMarker] = useState<Feature<Point> | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      const initialMarker = new Feature({
        geometry: new Point(fromLonLat([51.3890, 35.6892])), // Tehran coordinates
      });

      initialMarker.setStyle(
        new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: 'https://openlayers.org/en/latest/examples/data/icon.png',
          }),
        })
      );

      const vectorSource = new VectorSource({
        features: [initialMarker],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      const initialMap = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        view: new View({
          center: fromLonLat([51.3890, 35.6892]), // Tehran coordinates
          zoom: 10,
        }),
      });

      initialMap.on('click', (event) => {
        const clickedCoordinate = toLonLat(event.coordinate) as [number, number];
        setCoordinates(clickedCoordinate);

        if (marker) {
          marker.getGeometry()?.setCoordinates(event.coordinate);
        } else {
         
            initialMarker.setGeometry(new Point(event.coordinate),) 
          

          

        //   vectorSource.addFeature(newMarker);
        //   setMarker(newMarker);
        }
      });

      setMap(initialMap);
      setMarker(initialMarker);

      return () => initialMap.setTarget(undefined);
    }
  }, [mapRef]);

  const handleButtonClick = () => {
    if (coordinates) {
      console.log('Selected Coordinates:', coordinates);
    }
  };


  interface SearchLocResult {
    title?: string;
    address?: string;
    neighbourhood?: string;
    region?: string;
    type?: string;
    category?: string;
    location?: {
      x?: number;
      y?: number;
    };
  }

  const [searchData, setSearchData] = useState<SearchLocResult[]>([]);
  const [longitude, setLongitude] = useState<number | null | undefined>(51.389);
  const [latitude, setLatitude] = useState<number | null | undefined>(35.6892);

  async function searchLoc(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
    console.log(latitude);
    const result = await fetch(
      `https://api.neshan.org/v1/search?term=${e.target.value}&lat=${latitude}&lng=${longitude}`,
      {
        headers: {
          "Api-Key": "service.5b4e25ebc469407182ba7e7095cc2e7e",
        },
      }
    );
    if (!result.ok) {
      return;
    }
    const jsonResult = await result.json();
    console.log(jsonResult);
    if (jsonResult.items) {
      setSearchData(jsonResult.items);
    }
  }


//   async function firstPageSubmit() {
//     if (longitude && latitude) {
//       const result = await fetch(
//         `https://api.neshan.org/v5/reverse?lat=${latitude}&lng=${longitude}`,
//         {
//           headers: {
//             "Api-Key": "service.5b4e25ebc469407182ba7e7095cc2e7e",
//           },
//         }
//       );
//       if (result.ok) {
//         const jsonResult = await result.json();
//         console.log(jsonResult);
//         postLocationRef.current.value = jsonResult.formatted_address;
//       }
//     }
//     setShowFirstPage(false);
//     setShowSecondPage(true);
//   }



  return (
    <div className='w-full'>
      <div ref={mapRef} style={{ width: 'w-full', height: '400px' }} />
      <button onClick={handleButtonClick}>Log Coordinates</button>
      <div>
      {searchData.map((data, index) => {
              return (
                <li
                  key={index}
                  onClick={() => {
                    console.log(data);
                    const coordinates = fromLonLat([
                      data.location?.x || 3,
                      data.location?.y || 3,
                    ]);
                    // mapRef?.current?.getView().setCenter(coordinates);
                    // mapRef?.current?.getView().setZoom(15);
                    setLongitude(data.location?.x);
                    setLatitude(data.location?.y);
                  }}
                >
                  <div className=" flex-col">
                    <p className=" text-lg block">{data.title} </p>
                    <p className=" text-sm block">{data.address}</p>

                    {/* {
                    data.address == data.region? 
                    <p className=' text-sm'>{data.address}</p> 
                    :
                    <p className=' text-sm'>{data.address}{" "+ data.region}</p>
                } */}
                  </div>
                </li>
              );
            })}
      </div>
    </div>
  );
};

export default MapComponent;
