import { geoCentroid, geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import countries110m from 'world-atlas/countries-110m.json';

type Marker = {
  label: string;
  lon: number;
  lat: number;
  main?: boolean;
  dx?: number;
  dy?: number;
};

const WIDTH = 1200;
const HEIGHT = 700;

const rawCountries = feature(
  countries110m as any,
  (countries110m as any).objects.countries
) as any;

const americasFeatures = rawCountries.features.filter((country: any) => {
  const [lon, lat] = geoCentroid(country);
  return lon >= -170 && lon <= -20 && lat >= -60 && lat <= 85;
});

const americasCollection = {
  type: 'FeatureCollection',
  features: americasFeatures,
} as any;

const projection = geoMercator().fitExtent(
  [
    [40, 24],
    [WIDTH - 40, HEIGHT - 24],
  ],
  americasCollection
);

const path = geoPath(projection);

const markers: Marker[] = [
  { label: 'Colombia HQ', lon: -74.0721, lat: 4.711, main: true, dx: 18, dy: -8 },
  { label: 'US Hispanic', lon: -95.7129, lat: 37.0902, dx: 16, dy: -8 },
  { label: 'Mexico', lon: -102.5528, lat: 23.6345, dx: 14, dy: 18 },
  { label: 'Centroamerica', lon: -90.5, lat: 14.5, dx: 14, dy: 18 },
  { label: 'Peru', lon: -75.0152, lat: -9.19, dx: 14, dy: 18 },
  { label: 'Chile', lon: -71.543, lat: -35.6751, dx: 14, dy: 18 },
  { label: 'Argentina', lon: -63.6167, lat: -38.4161, dx: 14, dy: 18 },
];

export default function AmericasOperationsMap() {
  return (
    <div className="americas-map-bg" aria-hidden="true">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid slice">
        <g className="americas-grid">
          <path d="M50 610h1100" />
          <path d="M50 510h1100" />
          <path d="M50 410h1100" />
          <path d="M50 310h1100" />
          <path d="M50 210h1100" />
        </g>

        <g className="americas-land">
          {americasFeatures.map((country: any, index: number) => {
            const d = path(country);
            if (!d) return null;
            return <path key={`${country.id ?? 'c'}-${index}`} d={d} />;
          })}
        </g>

        <g>
          {markers.map((marker) => {
            const point = projection([marker.lon, marker.lat]);
            if (!point) return null;

            const [x, y] = point;
            const dx = marker.dx ?? 12;
            const dy = marker.dy ?? -8;

            return (
              <g key={marker.label}>
                <g className={`ops-dot${marker.main ? ' ops-dot-main' : ''}`} transform={`translate(${x},${y})`}>
                  <circle r={marker.main ? 9 : 7} />
                  {marker.main ? <circle className="ops-pulse" r={9} /> : null}
                </g>
                <text x={x + dx} y={y + dy} className="ops-label">
                  {marker.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
