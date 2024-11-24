declare module '@rnmapbox/maps' {
  namespace MapboxGL {
    function setAccessToken(token: string): void;
  }
  export = MapboxGL;
}
