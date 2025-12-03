import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const WeatherChart = ({ data }) => {
  const [activeMetric, setActiveMetric] = useState('temperature');
  
  if (!data || !data.forecast_hours) return null;
  
  // Prepare chart data
  const chartData = Object.entries(data.forecast_hours).map(([time, forecast]) => ({
    time: time.split(':')[0] + 'h',
    temperature: forecast.temperature,
    rainfall: forecast.rainfall,
    humidity: forecast.humidity,
    wind: forecast.wind_speed
  }));
  
  const metrics = [
    { key: 'temperature', label: 'Temperature', color: '#ef4444', unit: '°C' },
    { key: 'rainfall', label: 'Rainfall', color: '#3b82f6', unit: 'mm' },
    { key: 'humidity', label: 'Humidity', color: '#10b981', unit: '%' },
    { key: 'wind', label: 'Wind Speed', color: '#8b5cf6', unit: 'km/h' }
  ];
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-2xl">
          <p className="text-white font-bold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-gray-300">{entry.dataKey}</span>
              </div>
              <span className="font-bold text-white">
                {entry.value} {metrics.find(m => m.key === entry.dataKey)?.unit || ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div>
      {/* Metric Selector */}
      <div className="flex space-x-2 mb-6">
        {metrics.map((metric) => (
          <button
            key={metric.key}
            onClick={() => setActiveMetric(metric.key)}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeMetric === metric.key 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {metric.label}
          </button>
        ))}
      </div>
      
      {/* Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: '#9ca3af' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: '#9ca3af' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={activeMetric}
              stroke={metrics.find(m => m.key === activeMetric)?.color || '#3b82f6'}
              strokeWidth={3}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherChart;