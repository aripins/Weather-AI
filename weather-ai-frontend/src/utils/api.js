import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchWeatherData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/weather/general`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchWeatherByLocation = async (lat, lon) => {
  try {
    const response = await axios.get(`${API_BASE}/weather/by-location`, {
      params: { lat, lon }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather by location:', error);
    throw error;
  }
};

export const fetchWeatherByName = async (location) => {
  try {
    const response = await axios.get(`${API_BASE}/weather/by-name`, {
      params: { location }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather by name:', error);
    throw error;
  }
};

export const fetchManualWeather = async (data) => {
  try {
    const response = await axios.post(`${API_BASE}/weather/manual-input`, data);
    return response.data;
  } catch (error) {
    console.error('Error fetching manual weather:', error);
    throw error;
  }
};

// ... existing code ...

export const askChatbot = async (question, context) => {
  try {
    // Untuk development, kita simulasikan response
    // Di production, ini akan panggil backend
    return new Promise((resolve) => {
      setTimeout(() => {
        const responses = {
          'hujan': 'Berdasarkan data GIYU, hujan mempengaruhi operasi tambang sebagai berikut...',
          'angkut': 'Transportasi material saat hujan memerlukan perhatian khusus...',
          'suhu': 'Suhu tinggi dapat mempengaruhi produktivitas pekerja...',
          'default': 'Saya adalah AI Assistant untuk operasi tambang. Saya dapat membantu dengan prediksi cuaca, rekomendasi keselamatan, dan analisis produktivitas.'
        };
        
        const key = Object.keys(responses).find(k => 
          question.toLowerCase().includes(k)
        ) || 'default';
        
        resolve({
          answer: responses[key],
          confidence: 0.95,
          recommendations: [
            'Monitor kondisi cuaca setiap jam',
            'Sesuaikan operasi dengan kondisi aktual',
            'Prioritaskan keselamatan pekerja'
          ]
        });
      }, 1000);
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    throw error;
  }
};

// Fungsi untuk generate mining recommendations
export const generateMiningRecommendations = (weatherData) => {
  const rainfall = weatherData.rainfall || 0;
  const temperature = weatherData.temperature || 28;
  const windSpeed = weatherData.wind_speed || 5;
  
  let status = 'NORMAL';
  let productivity = 85;
  let recommendations = [];
  let alerts = [];
  
  if (rainfall > 20) {
    status = 'DARURAT';
    productivity = 30;
    recommendations = [
      '🛑 Hentikan semua operasi outdoor',
      '💧 Aktifkan sistem drainase darurat',
      '🚫 Tunda semua transportasi material',
      '📢 Evakuasi area berisiko'
    ];
    alerts.push(`Hujan lebat: ${rainfall}mm/jam`);
  } else if (rainfall > 10) {
    status = 'WASPADA TINGGI';
    productivity = 60;
    recommendations = [
      '⚠️ Kurangi aktivitas angkut barang',
      '🛣️ Fokus pada maintenance jalan',
      '🚜 Batasi alat berat di area miring',
      '📊 Adjust target produksi'
    ];
    alerts.push(`Hujan sedang: ${rainfall}mm/jam`);
  } else if (rainfall > 0) {
    status = 'WASPADA';
    productivity = 75;
    recommendations = [
      'ℹ️ Operasi dengan kecepatan reduced',
      '💦 Siapkan water truck ekstra',
      '📡 Komunikasi intensif antar alat',
      '🕒 Monitor kondisi setiap 2 jam'
    ];
  } else {
    status = 'OPTIMAL';
    productivity = 95;
    recommendations = [
      '✅ Maksimalkan semua operasi',
      '⚡ Optimalkan cycle time alat',
      '📈 Target produksi 100%',
      '🔧 Jadwalkan preventive maintenance'
    ];
  }
  
  return {
    status,
    productivity_score: productivity,
    recommendations,
    alerts,
    operational_hours: {
      day_shift: rainfall > 20 ? 0 : rainfall > 10 ? 4 : 8,
      night_shift: rainfall > 20 ? 0 : rainfall > 10 ? 6 : 8,
      total: rainfall > 20 ? 0 : rainfall > 10 ? 10 : 16
    }
  };
};