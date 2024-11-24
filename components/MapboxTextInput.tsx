import { useEffect, useState } from "react";
import { View, Image, TextInput, FlatList, Text, TouchableOpacity } from "react-native";
import MapboxGL from '@rnmapbox/maps';
import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";

const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

// Add Mapbox feature interface
interface MapboxFeature {
  place_name: string;
  center: [number, number];
  // Add other properties you might use
  text?: string;
  context?: Array<{type: string; text: string}>;
}

interface SearchResult {
  place_name: string;
  center: [number, number];
}

const MapboxTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=5`);
          const data = await response.json();

          const features = data.features;
          setSearchResults(
            features.map((feature: MapboxFeature) => ({
              place_name: feature.place_name,
              center: feature.center,
            })),
          );
        } catch (error) {
          console.error("Geocoding error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultPress = (result: SearchResult) => {
    handlePress({
      latitude: result.center[1],
      longitude: result.center[0],
      address: result.place_name,
    });
    setSearchResults([]);
    setSearchQuery(result.place_name);
  };

  useEffect(() => {
    if (MAPBOX_ACCESS_TOKEN) {
      MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);
    } else {
      console.error("Mapbox access token is not set");
    }
  }, [MAPBOX_ACCESS_TOKEN]);

  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
    >
      <View className="w-full">
        <View className="flex-row items-center px-4 py-2 bg-white rounded-full">
          <View className="justify-center items-center w-6 h-6 mr-2">
            <Image
              source={icon ? icon : icons.search}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={initialLocation ?? "Where do you want to go?"}
            placeholderTextColor="gray"
            className="flex-1 text-base font-semibold"
            style={{
              backgroundColor: textInputBackgroundColor
                ? textInputBackgroundColor
                : "white",
            }}
          />
        </View>

        {searchResults.length > 0 && (
          <View
            className="absolute top-16 left-0 right-0 bg-white rounded-lg shadow-lg z-50 mx-4"
            style={{
              backgroundColor: textInputBackgroundColor
                ? textInputBackgroundColor
                : "white",
            }}
          >
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.place_name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="px-4 py-3 border-b border-gray-100"
                  onPress={() => handleResultPress(item)}
                >
                  <Text className="text-base">{item.place_name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default MapboxTextInput;
