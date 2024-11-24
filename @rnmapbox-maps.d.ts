declare module '@rnmapbox/maps' {
  import { ReactNode } from 'react';
  import { LineLayerStyle } from '@mapbox/mapbox-gl-style-spec';

  export class ShapeSource extends React.Component<{
    id: string;
    shape?: any;
    children?: ReactNode;
  }> {}

  export class LineLayer extends React.Component<{
    id: string;
    style?: Partial<LineLayerStyle>;
  }> {}

  // Add other types as needed
}
