import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { EventItem } from '@hooks/useEventFeed';

type Props = {
  open: boolean;
  event: EventItem | null;
  onClose: () => void;
};

const EventDetails: React.FC<Props> = ({ open, event, onClose }) => {
  if (!open || !event) return null;
  const { title, body, airport, flightNum, severity, time, lat, lng } = event;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50">
      <div className="glass-panel rounded-2xl border border-white/10 backdrop-blur-xl w-full md:w-[800px] p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-white/70 hover:text-white">Schließen</button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Infos */}
          <div className="space-y-2">
            <p className="text-white/85">{body}</p>
            <div className="text-sm text-white/70 space-y-1">
              <div><b>Flug:</b> {flightNum ?? '—'}</div>
              <div><b>Airport:</b> {airport ?? '—'}</div>
              <div><b>Schweregrad:</b> {severity}</div>
              <div><b>Zeit:</b> {time ?? new Date().toLocaleString()}</div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => (window as any).openChatDock?.()}
                className="px-3 py-2 rounded-lg bg-[var(--brand-1)] text-black font-semibold"
              >
                Krisensitzung starten
              </button>
              <button
                onClick={() => (window as any).openChatDock?.()}
                className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 hover:bg-white/15"
              >
                Eigene Lösung vorschlagen
              </button>
            </div>
          </div>

          {/* Karte (falls Koordinaten) */}
          <div className="rounded-xl overflow-hidden border border-white/10">
            {lat !== undefined && lng !== undefined ? (
              <MapContainer center={[lat, lng]} zoom={6} style={{ height: 300, width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap"
                />
                <Marker position={[lat, lng]}>
                  <Popup>{airport ?? title}</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="h-[300px] w-full grid place-items-center text-white/60">
                Keine Positionsdaten vorhanden.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
