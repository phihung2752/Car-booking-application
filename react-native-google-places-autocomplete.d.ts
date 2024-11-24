declare module 'react-native-google-places-autocomplete' {
  import { ComponentProps } from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

  export interface GooglePlacesAutocompleteProps {
    placeholder?: string;
    minLength?: number;
    fetchDetails?: boolean;
    onPress?: (data: any, details: any | null) => void;
    styles?: {
      container?: ViewStyle;
      textInputContainer?: ViewStyle;
      textInput?: TextStyle;
      listView?: ViewStyle;
      description?: TextStyle;
      predefinedPlacesDescription?: TextStyle;
    };
    debounce?: number;
  }

  export class GooglePlacesAutocomplete extends React.Component<GooglePlacesAutocompleteProps> {}
}
