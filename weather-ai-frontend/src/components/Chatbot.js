import { Bot, Send, Sparkles, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const Chatbot = ({ isOpen, onClose, weatherData }) => {
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      content: 'Hello! Saya AI Assistant khusus untuk operasi tambang. Saya bisa membantu:\n\n• Prediksi cuaca untuk operasional\n• Rekomendasi keselamatan tambang\n• Analisis produktivitas\n• Panduan alat berat\n\nApa yang bisa saya bantu hari ini?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Pertanyaan cepat berdasarkan kondisi
  const getQuickQuestions = () => {
    if (!weatherData) return [
      'Bagaimana prediksi cuaca hari ini?',
      'Apakah aman untuk operasi tambang?',
      'Kapan waktu terbaik untuk angkut barang?',
      'Alat berat apa yang optimal?'
    ];
    
    const rainfall = weatherData.rainfall || 0;
    
    if (rainfall > 15) {
      return [
        '🛑 Haruskah hentikan semua operasi?',
        '💧 Bagaimana mengatasi genangan air?',
        '🚛 Bolehkah angkut material?',
        '⏱️ Kapan bisa operasi normal?'
      ];
    } else if (rainfall > 5) {
      return [
        '⚠️ Bagaimana operasi saat hujan?',
        '🚜 Persiapan alat berat apa?',
        '🛣️ Kondisi jalan tambang?',
        '📊 Pengaruh produktivitas?'
      ];
    } else {
      return [
        '✅ Bolehkah maksimalkan produksi?',
        '⛏️ Waktu optimal untuk stripping?',
        '🚛 Rute angkut terbaik?',
        '🔧 Maintenance alat kapan?'
      ];
    }
  };
  
  const quickQuestions = getQuickQuestions();
  
  // Fungsi untuk menghasilkan respons AI
  const generateAIResponse = (userQuestion) => {
    const question = userQuestion.toLowerCase();
    const rainfall = weatherData?.rainfall || 0;
    const temperature = weatherData?.temperature || 28;
    const windSpeed = weatherData?.wind_speed || 5;
    
    // Logika respons berdasarkan kata kunci
    if (question.includes('hujan') || question.includes('rain') || question.includes('basah')) {
      if (rainfall > 20) {
        return {
          response: `🛑 DARURAT: Hujan sangat lebat (${rainfall}mm/jam)\n\n` +
                    `• Hentikan semua operasi di area terbuka\n` +
                    `• Evakuasi pekerja dari lokasi berbahaya\n` +
                    `• Tunda angkut barang sampai kondisi membaik\n` +
                    `• Aktifkan pompa drainase darurat\n` +
                    `• Pantau level air di pit setiap 30 menit\n\n` +
                    `📊 Estimasi downtime: 4-6 jam`,
          icon: '⛈️'
        };
      } else if (rainfall > 10) {
        return {
          response: `⚠️ WASPADA: Hujan sedang (${rainfall}mm/jam)\n\n` +
                    `• Kurangi kecepatan angkut barang 50%\n` +
                    `• Pasang rantai pada dump truck\n` +
                    `• Fokus pada maintenance haul road\n` +
                    `• Batasi alat berat di area miring\n` +
                    `• Siapkan water truck ekstra\n\n` +
                    `📊 Produktivitas turun: 40-60%`,
          icon: '🌧️'
        };
      } else if (rainfall > 0) {
        return {
          response: `ℹ️ PERHATIAN: Hujan ringan (${rainfall}mm/jam)\n\n` +
                    `• Operasi bisa dilanjutkan dengan hati-hati\n` +
                    `• Monitor kondisi jalan setiap 2 jam\n` +
                    `• Cek sistem pengereman alat berat\n` +
                    `• Siapkan alat penyiram jalan\n` +
                    `• Komunikasi intensif antar operator\n\n` +
                    `📊 Produktivitas: 80-90%`,
          icon: '🌦️'
        };
      } else {
        return {
          response: `✅ OPTIMAL: Tidak ada hujan\n\n` +
                    `• Maksimalkan semua operasi produksi\n` +
                    `• Optimalkan rute angkut barang\n` +
                    `• Lakukan preventive maintenance\n` +
                    `• Targetkan produksi 100%\n` +
                    `• Pantau kondisi alat secara berkala\n\n` +
                    `📊 Produktivitas: 95-100%`,
          icon: '☀️'
        };
      }
    }
    
    else if (question.includes('angkut') || question.includes('transport') || question.includes('barang')) {
      if (rainfall > 15) {
        return {
          response: `🚫 TUNDA PENGGUNAAN DUMP TRUCK\n\n` +
                    `Alasan:\n` +
                    `• Jalan licin, risiko sliding tinggi\n` +
                    `• Visibility rendah (${weatherData?.visibility || 2}km)\n` +
                    `• Pengereman tidak optimal\n` +
                    `• Material basah meningkatkan muatan\n\n` +
                    `Rekomendasi:\n` +
                    `• Tunggu sampai hujan reda\n` +
                    `• Perbaiki kondisi haul road\n` +
                    `• Pasang chains dan cek ban\n` +
                    `• Kurangi muatan 30% jika terpaksa`,
          icon: '🚛'
        };
      } else if (rainfall > 5) {
        return {
          response: `⚠️ ANGGUT BARANG DENGAN HATI-HATI\n\n` +
                    `Persyaratan:\n` +
                    `• Kecepatan maksimal 20km/jam\n` +
                    `• Muatan maksimal 70% capacity\n` +
                    `• Rantai ban wajib terpasang\n` +
                    `• Driver berpengalaman\n\n` +
                    `Safety Checklist:\n` +
                    `✓ Cek kondisi rem\n` +
                    `✓ Cek tekanan ban\n` +
                    `✓ Pasang lampu hazard\n` +
                    `✓ Radio komunikasi aktif`,
          icon: '🚚'
        };
      } else {
        return {
          response: `✅ OPTIMAL UNTUK ANGKUT BARANG\n\n` +
                    `Kondisi Ideal:\n` +
                    `• Jalan kering dan stabil\n` +
                    `• Visibility baik (${weatherData?.visibility || 10}+ km)\n` +
                    `• Temperatur optimal (${temperature}°C)\n\n` +
                    `Rekomendasi:\n` +
                    `• Muatan maksimal 100%\n` +
                    `• Kecepatan normal 40km/jam\n` +
                    `• Optimalkan rute terpendek\n` +
                    `• Jadwalkan shift maksimal`,
          icon: '🚀'
        };
      }
    }
    
    else if (question.includes('suhu') || question.includes('temperature') || question.includes('panas')) {
      if (temperature > 35) {
        return {
          response: `🔥 HEAT STRESS ALERT (${temperature}°C)\n\n` +
                    `Risiko:\n` +
                    `• Heat stroke pada pekerja\n` +
                    `• Overheating mesin alat berat\n` +
                    `• Penurunan konsentrasi operator\n\n` +
                    `Protokol:\n` +
                    `• Tambah waktu istirahat 50%\n` +
                    `• Sediakan air minum setiap pos\n` +
                    `• Rotasi pekerja area terbuka\n` +
                    `• Operasi pagi & sore lebih intensif\n` +
                    `• Hindari puncak panas (11-14)`,
          icon: '🌡️'
        };
      } else if (temperature > 30) {
        return {
          response: `🌡️ SUHU TINGGI (${temperature}°C)\n\n` +
                    `Rekomendasi:\n` +
                    `• Extra hydration untuk pekerja\n` +
                    `• Monitor kondisi alat setiap 4 jam\n` +
                    `• Gunakan cooling vest jika ada\n` +
                    `• Optimalkan ventilasi cabin\n` +
                    `• Sediakan tempat teduh`,
          icon: '☀️'
        };
      } else {
        return {
          response: `✅ SUHU OPTIMAL (${temperature}°C)\n\n` +
                    `Kondisi ideal untuk:\n` +
                    `• Pekerjaan fisik maksimal\n` +
                    `• Operasi alat berat optimal\n` +
                    `• Konsentrasi operator prima\n` +
                    `• Minim risiko heat stress\n\n` +
                    `Manfaatkan kondisi ini untuk produksi maksimal!`,
          icon: '😊'
        };
      }
    }
    
    else if (question.includes('angin') || question.includes('wind') || question.includes('kencang')) {
      if (windSpeed > 30) {
        return {
          response: `💨 ANGIN BERBAHAYA (${windSpeed} km/jam)\n\n` +
                    `TINDAKAN SEGERA:\n` +
                    `• Turunkan boom excavator\n` +
                    `• Hentikan operasi crane\n` +
                    `• Ikat material ringan\n` +
                    `• Evakuasi area tinggi\n` +
                    `• Monitor arah angin\n\n` +
                    `Safety First: Prioritas keselamatan di atas produksi`,
          icon: '🌪️'
        };
      } else if (windSpeed > 20) {
        return {
          response: `💨 ANGIN KENCANG (${windSpeed} km/jam)\n\n` +
                    `Pengaruh pada operasi:\n` +
                    `• Kurangi muatan dump truck 20%\n` +
                    `• Batasi alat dengan profil tinggi\n` +
                    `• Monitor alat dengan CCTV\n` +
                    `• Siapkan anchor untuk tenda\n` +
                    `• Komunikasi intensif antar alat`,
          icon: '💨'
        };
      } else {
        return {
          response: `✅ ANGIN NORMAL (${windSpeed} km/jam)\n\n` +
                    `Tidak ada pembatasan khusus untuk:\n` +
                    `• Operasi alat tinggi\n` +
                    `• Pengangkatan material\n` +
                    `• Pekerjaan ketinggian\n` +
                    `• Transportasi ringan\n\n` +
                    `Lanjutkan operasi sesuai rencana`,
          icon: '🍃'
        };
      }
    }
    
    else if (question.includes('produktif') || question.includes('efisiensi') || question.includes('target')) {
      const score = weatherData?.mining_recommendations?.productivity_score || 85;
      
      return {
        response: `📊 ANALISIS PRODUKTIVITAS\n\n` +
                  `Skor Hari Ini: ${score}/100\n\n` +
                  `Faktor Penentu:\n` +
                  `• Curah Hujan: ${rainfall}mm (${rainfall > 10 ? 'Negatif' : 'Positif'})\n` +
                  `• Suhu: ${temperature}°C (${temperature > 35 ? 'Negatif' : 'Optimal'})\n` +
                  `• Angin: ${windSpeed} km/jam (${windSpeed > 25 ? 'Negatif' : 'Normal'})\n\n` +
                  `Rekomendasi Produktivitas:\n` +
                  `${score > 80 ? '• Maksimalkan semua shift\n• Optimalkan cycle time\n• Minimal downtime' : 
                    score > 60 ? '• Fokus pada area kering\n• Prioritasi maintenance\n• Adjust target produksi' : 
                    '• Fokus pada safety first\n• Minimalisir risiko\n• Planning ulang target'}`,
        icon: '📈'
      };
    }
    
    else if (question.includes('alat') || question.includes('excavator') || question.includes('dozer') || question.includes('truck')) {
      return {
        response: `🛠️ REKOMENDASI ALAT BERAT\n\n` +
                  `EXCAVATOR:\n` +
                  `• ${rainfall > 10 ? 'Gunakan bucket rock untuk material basah' : 'Bucket biasa optimal'}\n` +
                  `• Ground pressure: ${rainfall > 10 ? 'Monitor ketat' : 'Normal'}\n` +
                  `• Cycle time: ${rainfall > 10 ? 'Tambahkan 30%' : 'Optimal'}\n\n` +
                  
                  `DUMP TRUCK:\n` +
                  `• Muatan: ${rainfall > 10 ? 'Maks 70% capacity' : '100% capacity'}\n` +
                  `• Kecepatan: ${rainfall > 10 ? 'Maks 20km/jam' : 'Normal 40km/jam'}\n` +
                  `• Safety: ${rainfall > 5 ? 'Chains required' : 'Normal check'}\n\n` +
                  
                  `DOZER:\n` +
                  `• Fokus: ${rainfall > 10 ? 'Drainage maintenance' : 'Stripping & leveling'}\n` +
                  `• Blade: ${rainfall > 10 ? 'U-blade untuk material basah' : 'S-blade optimal'}`,
        icon: '⚙️'
      };
    }
    
    else if (question.includes('safety') || question.includes('aman') || question.includes('keselamatan')) {
      const alerts = weatherData?.mining_recommendations?.alerts || [];
      
      return {
        response: `🛡️ ANALISIS KESELAMATAN\n\n` +
                  `Status: ${weatherData?.mining_recommendations?.status || 'NORMAL'}\n\n` +
                  `${alerts.length > 0 ? `ALERT AKTIF:\n${alerts.map(a => `• ${a}`).join('\n')}\n\n` : ''}` +
                  `Checklist Harian:\n` +
                  `1. Alat berat: Cek rem, ban, sistem hidrolik\n` +
                  `2. PPE: Helm, sepatu safety, vest, masker\n` +
                  `3. Komunikasi: Radio, hand signal, sirene\n` +
                  `4. Area kerja: Drainage, stability, access\n` +
                  `5. Cuaca: Monitor setiap 2 jam\n\n` +
                  `Safety First!`,
        icon: '🛡️'
      };
    }
    
    else {
      return {
        response: `🤖 WEATHER AI MINING ASSISTANT\n\n` +
                  `Saya bisa membantu dengan:\n\n` +
                  `🌧️ Analisis Curah Hujan\n` +
                  `• Pengaruh pada operasi tambang\n` +
                  `• Rekomendasi angkut barang\n` +
                  `• Manajemen air dan drainase\n\n` +
                  `🌡️ Monitoring Suhu\n` +
                  `• Heat stress management\n` +
                  `• Optimasi shift kerja\n` +
                  `• Perlindungan pekerja\n\n` +
                  `💨 Analisis Angin\n` +
                  `• Safety alat tinggi\n` +
                  `• Transportasi material\n` +
                  `• Pekerjaan ketinggian\n\n` +
                  `📊 Produktivitas\n` +
                  `• Estimasi output harian\n` +
                  `• Optimasi alat berat\n` +
                  `• Manajemen downtime\n\n` +
                  `Coba tanyakan: "Bagaimana pengaruh hujan untuk angkut barang hari ini?"`,
        icon: '🤖'
      };
    }
  };
  
  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Simulasi AI thinking
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      const botMessage = { 
        type: 'bot', 
        content: aiResponse.response,
        icon: aiResponse.icon
      };
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };
  
  const handleQuickQuestion = (question) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-2xl h-[85vh] bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl border border-white/20 shadow-2xl flex flex-col m-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 p-6 rounded-t-3xl border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Mining AI Assistant</h3>
                <p className="text-sm text-cyan-300">Powered API Weather Dataset</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Messages Container */}
        <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-900/50 to-gray-800/50">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === 'bot' 
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-500' 
                      : 'bg-gradient-to-br from-amber-500 to-orange-500'
                  }`}>
                    {message.type === 'bot' ? (
                      message.icon ? (
                        <span className="text-lg">{message.icon}</span>
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                </div>
                
                {/* Message Bubble */}
                <div className={`rounded-2xl p-4 ${
                  message.type === 'bot' 
                    ? 'bg-white/10 border border-white/20 rounded-tl-none' 
                    : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-tr-none'
                }`}>
                  <div className="text-white whitespace-pre-line text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {message.type === 'bot' ? 'AI Assistant' : 'You'} • Just now
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-2xl rounded-tl-none p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Questions */}
        <div className="px-4 pt-4 border-t border-white/10 bg-gray-900/30">
          <p className="text-xs text-gray-400 mb-2">Pertanyaan cepat:</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs rounded-full transition-all duration-300 border border-white/10 hover:border-cyan-500/30"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-gray-900/50">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tanyakan tentang cuaca, operasi tambang, atau keselamatan..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none text-white placeholder-gray-400 pr-12 text-sm"
                disabled={loading}
                autoFocus
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                ⏎ Enter
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-300 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Contoh: "Bolehkah angkut barang saat hujan?" • "Alat apa yang optimal?" • "Bagaimana produktivitas hari ini?"
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;