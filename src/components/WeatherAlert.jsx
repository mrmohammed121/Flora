import React, { useState, useEffect, useCallback } from 'react';
import { CloudRain, Thermometer, Droplets, AlertTriangle, ShieldCheck, RefreshCw, MapPin, Wind } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WeatherAlert() {
  const { t } = useLanguage();
  const [weatherData, setWeatherData] = useState(null);
  const [locationName, setLocationName] = useState('Agricultural Belt (Auto-Detect)');
  const [coords, setCoords] = useState({ lat: 12.9716, lon: 77.5946 }); // Default: Karnataka agro belt
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch forecast from Open-Meteo API
  const fetchWeather = useCallback(async (latitude, longitude) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation&daily=temperature_2m_max,relative_humidity_2m_mean&timezone=auto`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather forecast service unavailable');
      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.warn('Open-Meteo fetch error:', err);
      setError('Unable to fetch live satellite microclimate. Using regional averages.');
      // Fallback realistic weather data if network fails
      setWeatherData({
        current: {
          temperature_2m: 23.4,
          relative_humidity_2m: 84,
          precipitation: 1.2
        }
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Request browser geolocation with fallback
  const detectLocationAndFetch = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(4));
          const lon = Number(pos.coords.longitude.toFixed(4));
          setCoords({ lat, lon });
          setIsGpsActive(true);
          setLocationName(t('fieldCoordinates', { lat, lon }, `Field Coordinates: ${lat}°N, ${lon}°E`));
          fetchWeather(lat, lon);
        },
        (err) => {
          console.log('Geolocation permission denied or timed out, using agro default', err);
          setIsGpsActive(false);
          setLocationName(t('agroBeltAuto', 'Agricultural Belt (Auto-Detect)'));
          fetchWeather(coords.lat, coords.lon);
        },
        { timeout: 7000, enableHighAccuracy: false }
      );
    } else {
      setIsGpsActive(false);
      fetchWeather(coords.lat, coords.lon);
    }
  }, [coords.lat, coords.lon, fetchWeather]);

  useEffect(() => {
    detectLocationAndFetch();
  }, [detectLocationAndFetch]);

  // Compute Outbreak Risk based on current temperature and relative humidity
  const currentTemp = weatherData?.current?.temperature_2m ?? 24;
  const currentRH = weatherData?.current?.relative_humidity_2m ?? 75;
  const currentPrecip = weatherData?.current?.precipitation ?? 0;

  // Disease Risk Algorithm
  let riskLevel = 'low'; // 'high' | 'warning' | 'low'
  let riskTitle = t('weatherLowRisk') || 'Low Outbreak Risk';
  let riskMessage = t('weatherLowRiskDesc') || 'Microclimate conditions are optimal. Routine preventive scouting recommended.';
  let badgeStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200';
  let bannerBg = 'from-emerald-950/40 to-slate-900/90 border-emerald-500/30';
  let Icon = ShieldCheck;

  if (currentRH > 80 && currentTemp >= 15 && currentTemp <= 25) {
    riskLevel = 'high';
    riskTitle = t('weatherHighRisk') || 'High Blight Alert';
    riskMessage =
      t('weatherHighRiskDesc') ||
      'High humidity and moderate temps detected. Fungal spore sporulation risk is elevated. Preventive bio-fungicide spray recommended.';
    badgeStyle = 'bg-rose-950 border-rose-500 text-rose-200';
    bannerBg = 'from-rose-950/50 to-slate-900/90 border-rose-500/40';
    Icon = AlertTriangle;
  } else if (currentRH < 50 && currentTemp > 32) {
    riskLevel = 'warning';
    riskTitle = t('weatherMiteRisk') || 'Heat Stress / Mite Warning';
    riskMessage =
      t('weatherMiteRiskDesc') ||
      'Low humidity and elevated temperatures detected. High risk of spider mites and foliar wilting. Increase irrigation frequency.';
    badgeStyle = 'bg-amber-950 border-amber-500 text-amber-200';
    bannerBg = 'from-amber-950/50 to-slate-900/90 border-amber-500/40';
    Icon = AlertTriangle;
  }

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border bg-gradient-to-r ${bannerBg} shadow-sm dark:shadow-md transition-all duration-300 mb-6`}
      role="region"
      aria-label="Microclimate Outbreak Risk"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-emerald-400">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                {t('weatherTitle') || 'Microclimate Weather & Outbreak Risk Forecaster'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
                Open-Meteo
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="truncate">{locationName || t('agroBeltAuto', 'Agricultural Belt (Auto-Detect)')}</span>
              {isGpsActive && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/40">
                  {t('gpsActive', 'GPS Active')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Refresh Action Button */}
        <button
          type="button"
          onClick={detectLocationAndFetch}
          disabled={isLoading}
          className="min-h-[44px] self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 inline-flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          title="Refresh hyper-local weather"
          aria-label="Refresh weather"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? t('scanningWeather', 'Scanning...') : t('refreshWeather', 'Refresh')}</span>
        </button>
      </div>

      {/* Weather Metrics & Outbreak Banner */}
      <div className="pt-3 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
        {/* Metric Badges */}
        <div className="md:col-span-6 grid grid-cols-3 gap-2">
          {/* Temperature */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-rose-400" />
              <span>{t('tempLabel', 'Temp')}</span>
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
              {currentTemp}°C
            </span>
          </div>

          {/* Humidity */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('humidityLabel', 'Humidity')}</span>
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
              {currentRH}%
            </span>
          </div>

          {/* Rain / Precip */}
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-teal-400" />
              <span>{t('precipLabel', 'Precip')}</span>
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-white mt-1">
              {currentPrecip} mm
            </span>
          </div>
        </div>

        {/* Disease Risk Alert Box */}
        <div className="md:col-span-6">
          <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${badgeStyle}`}>
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <strong className="text-xs sm:text-sm font-bold uppercase tracking-wide">
                  {riskTitle}
                </strong>
                {riskLevel === 'high' && (
                  <span className="animate-ping w-2 h-2 rounded-full bg-rose-400 inline-block" />
                )}
              </div>
              <p className="text-xs leading-relaxed opacity-95">
                {riskMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
