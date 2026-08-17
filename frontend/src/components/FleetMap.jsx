import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

const vehicles = [
  {
    id: 1,
    name: 'Truck-101',
    status: 'Running',
    driver: 'Rahul',
    position: [28.6139, 77.2090]
  },
  {
    id: 2,
    name: 'Truck-102',
    status: 'Idle',
    driver: 'Amit',
    position: [28.6200, 77.2200]
  },
  {
    id: 3,
    name: 'Truck-103',
    status: 'Maintenance',
    driver: '-',
    position: [28.6000, 77.1900]
  }
]

export default function FleetMap() {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid #e2e8f0'
      }}
    >
      <div
        style={{
          padding: 20,
          fontWeight: 600,
          fontSize: 16
        }}
      >
        Live Fleet Map
      </div>

      <MapContainer
        center={[28.6139, 77.209]}
        zoom={12}
        style={{
          height: 420,
          width: '100%'
        }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehicles.map(vehicle => (
          <Marker
            key={vehicle.id}
            position={vehicle.position}
          >
            <Popup>
              <b>{vehicle.name}</b>

              <br />

              Status: {vehicle.status}

              <br />

              Driver: {vehicle.driver}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}