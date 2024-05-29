"use client";
import { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker } from "react-map-gl";
import { setDefaults, fromAddress } from "react-geocode";
import ReactMapGl, { ViewState } from "react-map-gl";
import Spinner from "../Spinner";
import Image from "next/image";
import pin from "@/app/assets/images/pin.svg";

const PropertyMap = ({ property }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: "100%",
    height: "500px",
  });
  const [loading, setLoading] = useState(true);
  const [geoError, setGeoError] = useState(false);

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY, // Your API key here.
    language: "en", // Default language for responses.
    region: "us", // Default region for responses.
  });
  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fromAddress(
          `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
        );
        if (res.results.length === 0) {
          setGeoError(true);
          setLoading(false);
          return;
        }
        const { lat, lng } = res.results[0].geometry.location;
        setLatitude(lat);
        setLongitude(lng);

        setViewport({
          ...viewport,
          latitude: lat,
          longitude: lng,
        });
      } catch (error) {
        console.log(error);
        setGeoError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCoords();
  }, []);

  //console.log(latitude, longitude);
  if (loading) return <Spinner loading={loading} />;
  if (geoError) {
    return <div className="text-xl">No location data found</div>;
  }
  return (
    !loading && (
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mabLib={import("mapbox-gl")}
        initialViewState={{
          longitude: longitude,
          latitude: latitude,
          zoom: 15,
        }}
        style={{ width: "100%", height: 500 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker longitude={longitude} latitude={latitude} anchor="bottom">
          <Image src={pin} alt="location" width={40} height={40} />
        </Marker>
      </Map>
    )
  );
};

export default PropertyMap;
