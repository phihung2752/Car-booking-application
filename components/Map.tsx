import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Mapbox from "@rnmapbox/maps";
import { lineString as makeLineString } from "@turf/helpers";

import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, MarkerData } from "@/types/type";

const Map = () => {
  useEffect(() => {
    const token = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (token) {
      Mapbox.setAccessToken(token);
    } else {
      console.error("Mapbox access token is not set");
    }
  }, []);

  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();

  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;

      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });

      setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  useEffect(() => {
    if (
      markers.length > 0 &&
      destinationLatitude !== undefined &&
      destinationLongitude !== undefined
    ) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [
    markers,
    destinationLatitude,
    destinationLongitude,
    setDrivers,
    userLatitude,
    userLongitude,
  ]);

  if (loading || (!userLatitude && !userLongitude))
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  if (error)
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );

  const route =
    destinationLatitude && destinationLongitude && userLatitude && userLongitude
      ? makeLineString([
          [userLongitude, userLatitude],
          [destinationLongitude, destinationLatitude],
        ])
      : null;

  return (
    <Mapbox.MapView
      styleURL={Mapbox.StyleURL.Street}
      className="w-full h-full rounded-2xl"
      zoomLevel={14}
      centerCoordinate={[userLongitude || 0, userLatitude || 0]}
    >
      <Mapbox.Camera
        zoomLevel={14}
        centerCoordinate={[userLongitude || 0, userLatitude || 0]}
        animationMode="flyTo"
        animationDuration={0}
      />

      {markers.map((marker) => (
        <Mapbox.PointAnnotation
          key={marker.id}
          id={`marker-${marker.id}`}
          coordinate={[marker.longitude, marker.latitude]}
          title={marker.title}
        >
          <Mapbox.Callout title={marker.title} />
        </Mapbox.PointAnnotation>
      ))}

      {destinationLatitude && destinationLongitude && (
        <>
          <Mapbox.PointAnnotation
            key="destination"
            id="destination"
            coordinate={[destinationLongitude, destinationLatitude]}
            title="Destination"
          >
            <Mapbox.Callout title="Destination" />
          </Mapbox.PointAnnotation>

          {route && (
            <Mapbox.ShapeSource id="routeSource" shape={route}>
              <Mapbox.LineLayer
                id="routeFill"
                style={{
                  lineColor: "#0286FF",
                  lineWidth: 2,
                }}
              />
            </Mapbox.ShapeSource>
          )}
        </>
      )}
    </Mapbox.MapView>
  );
};

export default Map;
