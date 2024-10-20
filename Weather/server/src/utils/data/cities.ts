const cities = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "Hyderabad",
];

interface CityCoordinates {
  lat: number;

  lon: number;
}
const citiesLatLon: { [key: string]: CityCoordinates } = {
  Delhi: { lat: 28.7041, lon: 77.1025 },
  Mumbai: { lat: 19.076, lon: 72.8777 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Bangalore: { lat: 12.9716, lon: 77.5946 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },
  Hyderabad: { lat: 17.385, lon: 78.4867 },
};

export default cities;
export { citiesLatLon };
