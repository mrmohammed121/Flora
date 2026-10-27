// src/components/TicketCard.jsx
// Visual Event Ticket Card Populated Dynamically from JSON
import React from 'react';
import defaultTicketData from '../data/eventTicket.json';
import './TicketCard.css';

export default function TicketCard({ data = defaultTicketData }) {
  // Helper to format seconds into mm:ss timestamp (e.g. 0.0 -> 00:00, 2.0 -> 00:02)
  const formatTime = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) return '00:00';
    const totalSec = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Check if data is an audio/video transcription schema (like twww_3.json)
  const isTranscription = Boolean(data.segments || (data.text && data.language));
  const firstSegment = (data.segments && data.segments.length > 0) ? data.segments[0] : null;

  // Extract values supporting both nested full-card JSON schema, flat structure, and transcription JSON
  let headerTitle = data.header?.title || (typeof data.header === 'string' ? data.header : 'TICKET');
  let scissorIcon = data.header?.cutoutIcon || data.symbol || '✁';
  let watermarkNotes = data.watermark?.symbols || ['♪♪♪♪♪', '♪♪♪♪', '♪♪♪♪♪'];
  let passType = data.body?.passType || data.passType || 'Day pass';
  let dateStr = data.body?.date || data.date || 'May 14th 2026';
  let venueData = data.body?.venue || data.venue;
  let seatLabel = data.footer?.seatLabel || 'Seat';
  let seatNumber = data.footer?.seatNumber || data.seat || 'E7';
  let barcodeValue = data.footer?.barcode?.code || data.barcode || '98421074523';

  // Apply transcription mapping if transcription format is detected
  if (isTranscription) {
    const rawText = (firstSegment && firstSegment.text) || data.text || 'You';
    const cleanText = rawText.trim();
    const detectedLang = (data.language || 'en').toUpperCase();
    const segmentId = firstSegment && typeof firstSegment.id !== 'undefined' ? firstSegment.id : 0;

    let timeRange = '00:00 - 00:02';
    if (firstSegment && typeof firstSegment.start === 'number' && typeof firstSegment.end === 'number') {
      timeRange = `${formatTime(firstSegment.start)} - ${formatTime(firstSegment.end)}`;
    }

    passType = `Clip #${segmentId} • ${detectedLang}`;
    dateStr = timeRange;
    venueData = `“${cleanText}”`;
    seatLabel = 'ID';
    seatNumber = `#${String(segmentId).padStart(2, '0')}`;
  }

  // Format date ordinal (e.g., 14th -> 14<sup>th</sup>)
  const renderDate = (str) => {
    if (!str) return 'May 14th 2026';
    const match = str.match(/^(.*?)(\d+)(st|nd|rd|th)(.*)$/i);
    if (match) {
      return (
        <>
          {match[1]}{match[2]}<sup>{match[3]}</sup>{match[4]}
        </>
      );
    }
    return str;
  };

  // Format venue address block from string or JSON object
  const renderVenue = (venue) => {
    if (typeof venue === 'string') {
      const lines = venue.split('\n');
      return lines.map((line, idx) => (
        <React.Fragment key={idx}>
          {line}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      ));
    }
    if (venue && typeof venue === 'object') {
      return (
        <>
          {venue.line1 || venue.address || 'Venue address,'}<br />
          {venue.line2 || `${venue.state || 'State'}${venue.zip ? `, ${venue.zip}` : ', #####'}`}
        </>
      );
    }
    return (
      <>
        Venue address,<br />
        State, #####
      </>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* ── Visual Layout & Design (Matching Reference Image) ── */}
      <div className="uiverse-ticket-card">
        {/* Watermark Musical Notes */}
        {watermarkNotes.map((note, index) => (
          <div key={index} className="notes">{note}</div>
        ))}

        {/* Extended Media (Video / Image) filling the card */}
        <div className="body">
          <video
            className="card-video"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/aiiii.mp4" type="video/mp4" />
            <source src="/ticket-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Holographic Pearlescent Gradient Background */}
        <div className="bg holographic"></div>

        {/* SVG Texture & Specular Lighting Filter */}
        <svg className="filter" width="0" height="0" style={{ position: 'absolute' }}>
          <filter id="bump">
            <feTurbulence
              result="noise"
              numOctaves="3"
              baseFrequency="0.7"
              type="fractalNoise"
            />
            <feSpecularLighting
              in="noise"
              result="specular"
              lightingColor="#fffffc"
              specularExponent="25"
              specularConstant="0.8"
              surfaceScale="0.15"
            >
              <fePointLight z="210" y="100" x="100" />
            </feSpecularLighting>
            <feComposite
              result="noise2"
              operator="in"
              in="specular"
              in2="SourceGraphic"
            />
            <feBlend mode="screen" in2="noise2" in="SourceGraphic" />
          </filter>
        </svg>
      </div>
    </div>
  );
}
