import { Activity, AlertTriangle, Cloud, Droplets, Eye, HardHat, Minimize2, Navigation, Snowflake, Sun, Thermometer, Wind } from 'lucide-react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Chatbot from '../components/Chatbot';
import Header from '../components/Header';
import MiningDashboard from '../components/MiningDashboard';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import WeatherChart from '../components/WeatherChart';
import { fetchWeatherByLocation, fetchWeatherByName, fetchWeatherData } from '../utils/api';

// --- FUNGSI UTILITAS: generateMiningRecommendations ---
const generateMiningRecommendations = (data) => {
  const { temperature, rainfall, wind_speed, humidity } = data;
  let status = "NORMAL";
  let productivity_score = 90;
  let recommendations = ["Kondisi ideal untuk operasi tambang.", "Maksimalkan produktivitas alat berat."];
  let alerts = [];

  // Logika rekomendasi
  if (rainfall > 10) {
    status = "RISIKO TINGGI";
    productivity_score = 40;
    recommendations = ["Tunda semua operasi penambangan luar ruangan.", "Waspada longsor dan banjir."];
    alerts.push("Hujan Lebat: Curah hujan tinggi (>10mm). Jeda operasional wajib.");
  } else if (rainfall > 5) {
    status = "HATI-HATI";
    productivity_score = 65;
    recommendations = ["Kurangi kecepatan alat berat.", "Fokus pada penguatan jalan angkut.", "Siapkan pompa air."];
    alerts.push("Hujan Sedang: Curah hujan sedang. Kecepatan alat dibatasi.");
  }

  if (wind_speed > 35) {
    status = status === "NORMAL" ? "HATI-HATI" : status;
    productivity_score = Math.max(0, productivity_score - 10);
    recommendations.push("Angin kencang: Amankan material lepas dan batasi pekerjaan di ketinggian.");
    alerts.push("Peringatan Angin: Kecepatan angin di atas 35 km/h.");
  }

  if (temperature > 35 && humidity < 40) {
    status = status === "NORMAL" ? "HATI-HATI" : status;
    recommendations.push("Panas tinggi/kering: Wajibkan istirahat ekstra dan hidrasi bagi pekerja.");
  } else if (temperature < 10) {
    status = status === "NORMAL" ? "HATI-HATI" : status;
    recommendations.push("Suhu rendah: Lakukan pemanasan mesin sebelum operasi.");
  }
  
  // Tambahkan rekomendasi default jika status NORMAL
  if (status === "NORMAL" && recommendations.length < 3) {
      recommendations.push("Jadwalkan maintenance rutin", "Optimasi rute angkut barang");
  }

  return {
    status,
    productivity_score: Math.max(0, productivity_score),
    recommendations: [...new Set(recommendations)], 
    alerts,
    operational_hours: { day_shift: 8, night_shift: 8, total: 16 }
  };
};

// --- KOMPONEN HOME ---

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('weather');
  const [showChatbot, setShowChatbot] = useState(false);

  // Load initial weather data
  useEffect(() => {
    loadInitialWeather();
  }, []);

  // --- FUNGSI loadInitialWeather ---
  const loadInitialWeather = async () => {
    try {
      setLoading(true);
      const data = await fetchWeatherData();
      
      const completeData = {
        ...data,
        visibility: 8 + Math.random() * 7, 
        cloud_cover: Math.random() * 100,
        dew_point: parseFloat((data.temperature - 5 + Math.random() * 2).toFixed(1)), 
        pressure: data.pressure || 1013, 
      };

      const miningRecs = generateMiningRecommendations(completeData);
      
      setWeatherData({
        ...completeData,
        mining_recommendations: miningRecs,
      });
      
      if (typeof window !== 'undefined' && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lon: longitude });
            const locationData = await fetchWeatherByLocation(latitude, longitude);
            
            const completeLocationData = {
              ...locationData,
              visibility: 8 + Math.random() * 7,
              cloud_cover: Math.random() * 100,
              dew_point: parseFloat((locationData.temperature - 5 + Math.random() * 2).toFixed(1)),
              pressure: locationData.pressure || 1013,
            };

            const locationMiningRecs = generateMiningRecommendations(completeLocationData);
            
            setWeatherData({
              ...completeLocationData,
              mining_recommendations: locationMiningRecs,
            });
          },
          () => {
            console.log('Location access denied. Using default or API fallback data.');
          }
        );
      }
    } catch (err) {
      setError('Failed to load weather data');
      
      // Fallback dengan data lengkap
      const fallbackData = {
        temperature: 28.5,
        humidity: 75,
        rainfall: 2.3,
        wind_speed: 4.2,
        pressure: 1013, 
        description: "Partly Cloudy",
        location: "Default Mining Site",
        visibility: 12, 
        cloud_cover: 40, 
        dew_point: 23,
        forecast_hours: {
          "14:00": { temperature: 29.1, humidity: 72, rainfall: 1.8, wind_speed: 4.5 },
          "15:00": { temperature: 28.8, humidity: 74, rainfall: 2.1, wind_speed: 4.0 },
          "16:00": { temperature: 28.2, humidity: 77, rainfall: 2.5, wind_speed: 3.8 },
          "17:00": { temperature: 27.6, humidity: 80, rainfall: 3.0, wind_speed: 3.5 },
          "18:00": { temperature: 26.9, humidity: 83, rainfall: 2.8, wind_speed: 3.2 }
        }
      };
      
      const miningRecs = generateMiningRecommendations(fallbackData);
      
      setWeatherData({
        ...fallbackData,
        mining_recommendations: miningRecs
      });
    } finally {
      setLoading(false);
    }
  };
  // --- END loadInitialWeather ---

  // handleSearch disesuaikan
  const handleSearch = async (location) => {
    try {
      setLoading(true);
      const data = await fetchWeatherByName(location);

      const completeData = {
        ...data,
        visibility: 8 + Math.random() * 7,
        cloud_cover: Math.random() * 100,
        dew_point: parseFloat((data.temperature - 5 + Math.random() * 2).toFixed(1)),
        pressure: data.pressure || 1013,
      };

      const miningRecs = generateMiningRecommendations(completeData);
      
      setWeatherData({
        ...completeData,
        mining_recommendations: miningRecs,
      });

    } catch (err) {
      setError('Location not found');
    } finally {
      setLoading(false);
    }
  };

  // requestLocation disesuaikan
  const requestLocation = () => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          const data = await fetchWeatherByLocation(latitude, longitude);

          const completeData = {
            ...data,
            visibility: 8 + Math.random() * 7,
            cloud_cover: Math.random() * 100,
            dew_point: parseFloat((data.temperature - 5 + Math.random() * 2).toFixed(1)),
            pressure: data.pressure || 1013,
          };

          const miningRecs = generateMiningRecommendations(completeData);
          
          setWeatherData({
            ...completeData,
            mining_recommendations: miningRecs,
          });

        },
        () => alert('Location access is required for accurate predictions')
      );
    }
  };

  const tabs = [
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'mining', label: 'Mining Ops', icon: HardHat },
    { id: 'forecast', label: 'Forecast', icon: Activity },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'weather':
        return (
          // Disesuaikan: max-w-6xl
          <div className="max-w-6xl mx-auto"> 
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white">Weather Analytics</h2>
                      <p className="text-gray-400">Real-time weather trends and predictions</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-gray-300">Live Data</span>
                    </div>
                  </div>
                  <div className="flex-grow"> 
                    <WeatherChart data={weatherData} />
                  </div>
                </div>
              </div>
              <div>
                <WeatherCard data={weatherData} />
              </div>
            </div>
          </div>
        );
      
      case 'mining':
        return (
          // Disesuaikan: max-w-6xl
          <div className="max-w-6xl mx-auto">
            <MiningDashboard weatherData={weatherData} />
          </div>
        );
      
      case 'forecast':
        return (
          // Disesuaikan: max-w-6xl
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">5-Hour Forecast</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {weatherData && Object.entries(weatherData.forecast_hours).map(([time, forecast], index) => (
                  <div key={index} className="text-center p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                    <div className="text-gray-400 text-sm">{time}</div>
                    <div className="text-3xl my-3">
                      {forecast.rainfall > 5 ? '🌧️' : forecast.rainfall > 0 ? '🌦️' : '☀️'}
                    </div>
                    <div className="text-xl font-bold text-white">{forecast.temperature}°C</div>
                    <div className="text-sm text-gray-400 mt-1">Rain: {forecast.rainfall}mm</div>
                    <div className="text-sm text-gray-400">Wind: {forecast.wind_speed} km/h</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <Head>
        <title>Weather AI Mining | Smart Weather Prediction</title>
        <meta name="description" content="AI-powered weather predictions for mining operations" />
      </Head>

      <div className="relative z-10">
        {/* Header */}
        <Header 
          location={userLocation}
          onLocationRequest={requestLocation}
        />

        <main className="container mx-auto px-4 py-8">
          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar onSearch={handleSearch} />
            
            {/* Quick Location Buttons */}
            {/* Disesuaikan: max-w-4xl */}
            <div className="flex flex-wrap justify-center gap-3 mt-4 max-w-4xl mx-auto">
              {['Jakarta', 'Bandung', 'Surabaya', 'Bali'].map((city) => (
                <button
                  key={city}
                  onClick={() => handleSearch(city)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-gray-300 hover:text-white transition-all text-sm"
                >
                  {city}
                </button>
              ))}
              <button
                onClick={requestLocation}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-full text-white transition-all flex items-center space-x-2"
              >
                <Navigation className="w-4 h-4" />
                <span>My Location</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            // Disesuaikan: max-w-6xl
            <div className="max-w-6xl mx-auto mb-6 bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
              <p className="mt-4 text-gray-400">Loading weather intelligence...</p>
            </div>
          ) : weatherData ? (
            <>
              {/* Weather Alerts */}
              {(weatherData.rainfall > 10 || weatherData.wind_speed > 35) && (
                // Disesuaikan: max-w-6xl
                <div className="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-500/50 rounded-2xl p-6 backdrop-blur-sm">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                    <div>
                      <h3 className="text-lg font-bold text-white">Weather Alert: {weatherData.mining_recommendations.alerts.join(' | ')}</h3>
                      <p className="text-orange-200">
                        {weatherData.mining_recommendations.recommendations[0]}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="max-w-6xl mx-auto mb-8">
                <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-2xl p-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 px-4 rounded-xl text-center transition-all duration-300 ${
                          activeTab === tab.id 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{tab.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Content (Menggunakan max-w-6xl di renderTabContent) */}
              {renderTabContent()}

              {/* Quick Stats (LAYOUT 4 KARTU PER BARIS) */}
              
              {/* BARIS PERTAMA (4 Kartu: Temp, Humidity, Rainfall, Wind Speed) */}
              {/* Disesuaikan: max-w-6xl */}
              <div className="max-w-6xl mx-auto mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"> 
                {/* Kartu 1: Temp */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Thermometer className="w-5 h-5 text-red-400" />
                    <span className="text-gray-400">Temp</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{weatherData.temperature}°C</div>
                  <div className="text-xs text-gray-400">Feels like {weatherData.temperature - 2}°C</div>
                </div>
                
                {/* Kartu 2: Humidity */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-400">Humidity</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{weatherData.humidity}%</div>
                  <div className="text-xs text-gray-400">
                    {weatherData.humidity > 80 ? 'High' : 'Normal'}
                  </div>
                </div>
                
                {/* Kartu 3: Rainfall */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Cloud className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-400">Rainfall</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{weatherData.rainfall}mm</div>
                  <div className="text-xs text-gray-400">Last 3 hours</div>
                </div>
                
                {/* Kartu 4: Wind Speed */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wind className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400">Wind Speed</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{weatherData.wind_speed} km/h</div>
                  <div className="text-xs text-gray-400">
                    {weatherData.wind_speed > 30 ? 'Strong' : 'Normal'}
                  </div>
                </div>
              </div>
              
              {/* BARIS KEDUA (4 Kartu: Visibility, Cloud Cover, Dew Point, Pressure) */}
              {/* Disesuaikan: max-w-6xl */}
              <div className="max-w-6xl mx-auto mt-4 grid grid-cols-2 md:grid-cols-4 gap-4"> 
                {/* Kartu 5: Visibility */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400">Visibility</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{weatherData.visibility.toFixed(1)} km</div>
                  <div className="text-xs text-gray-400">
                    {weatherData.visibility < 10 ? 'Low' : 'Good'}
                  </div>
                </div>

                {/* Kartu 6: Cloud Cover */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sun className="w-5 h-5 text-orange-400" />
                    <span className="text-gray-400">Cloud Cover</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{weatherData.cloud_cover.toFixed(0)}%</div>
                  <div className="text-xs text-gray-400">
                    {weatherData.cloud_cover > 70 ? 'Overcast' : 'Clear'}
                  </div>
                </div>
                
                {/* Kartu 7: Dew Point */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Snowflake className="w-5 h-5 text-cyan-400" />
                    <span className="text-gray-400">Dew Point</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{weatherData.dew_point}°C</div>
                  <div className="text-xs text-gray-400">
                    {weatherData.dew_point > 25 ? 'High Moisture' : 'Normal'}
                  </div>
                </div>

                {/* Kartu 8: Pressure */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Minimize2 className="w-5 h-5 text-indigo-400" /> 
                    <span className="text-gray-400">Pressure</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{weatherData.pressure} hPa</div> 
                  <div className="text-xs text-gray-400">
                    {weatherData.pressure > 1020 ? 'High' : weatherData.pressure < 1000 ? 'Low' : 'Normal'}
                  </div>
                </div>
                
              </div>
            </>
          ) : null}
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t border-white/10 py-6">
          <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
            <p>©Capstone Project ASAH 2025. FEBE & ML Team.</p>
            <p className="mt-2">Real-time weather intelligence for mining operations.</p>
          </div>
        </footer>
      </div>

      {/* Chatbot Button */}
      <button
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-6 right-6 z-40 group"
      >
        <div className="relative">
          {/* Pulsing Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-ping opacity-20"></div>
          
          {/* Main Button */}
          <div className="relative bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 group-hover:scale-110">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"> 
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          
          {/* Notification Badge jika ada alert */}
          {(weatherData?.rainfall > 10 || weatherData?.wind_speed > 35) && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-3 h-3" />
            </div>
          )}
        </div>
      </button>

      {/* Chatbot Component */}
      <Chatbot 
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        weatherData={weatherData}
      />

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
}