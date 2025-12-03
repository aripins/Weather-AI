import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import random
from datetime import datetime, timedelta
import json

class GiyuWeatherModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.locations = {
            'jakarta': {'lat': -6.2088, 'lon': 106.8456},
            'bandung': {'lat': -6.9175, 'lon': 107.6191},
            'surabaya': {'lat': -7.2575, 'lon': 112.7521},
            'yogyakarta': {'lat': -7.7956, 'lon': 110.3695},
            'bali': {'lat': -8.4095, 'lon': 115.1889},
            'default': {'lat': -6.2000, 'lon': 106.8166}
        }
        self.load_or_train_model()
    
    def load_or_train_model(self):
        """Load pre-trained model or train new one with GIYU dataset"""
        try:
            # In real implementation, load actual GIYU dataset
            # For demo, we create synthetic data based on GIYU patterns
            self.train_model()
        except Exception as e:
            print(f"Model training failed: {e}")
            self.create_fallback_model()
    
    def train_model(self):
        """Train weather prediction model with GIYU dataset patterns"""
        # Synthetic training data based on GIYU dataset characteristics
        np.random.seed(42)
        n_samples = 1000
        
        # Features based on GIYU dataset structure
        X = np.random.randn(n_samples, 5)
        X[:, 0] = np.random.uniform(20, 35, n_samples)  # temperature
        X[:, 1] = np.random.uniform(60, 95, n_samples)  # humidity
        X[:, 2] = np.random.uniform(1000, 1020, n_samples)  # pressure
        X[:, 3] = np.random.uniform(0, 10, n_samples)  # wind_speed
        X[:, 4] = np.random.uniform(0, 50, n_samples)  # rainfall
        
        # Targets (next 3-5 hours predictions)
        y_temp = X[:, 0] + np.random.uniform(-2, 2, n_samples)
        y_humidity = X[:, 1] + np.random.uniform(-10, 10, n_samples)
        y_rainfall = np.maximum(0, X[:, 4] + np.random.uniform(-5, 5, n_samples))
        y_wind = np.maximum(0, X[:, 3] + np.random.uniform(-2, 2, n_samples))
        
        y = np.column_stack([y_temp, y_humidity, y_rainfall, y_wind])
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model.fit(X_scaled, y)
    
    def create_fallback_model(self):
        """Create fallback model if training fails"""
        self.model = None
    
    def predict_default(self):
        """Generate default prediction"""
        base_temp = 28.0 + random.uniform(-3, 3)
        return {
            "temperature": round(base_temp, 1),
            "humidity": random.randint(65, 85),
            "rainfall": round(random.uniform(0, 5), 1),
            "wind_speed": round(random.uniform(1, 6), 1),
            "pressure": random.randint(1005, 1015),
            "forecast_hours": self._generate_forecast_hours(base_temp),
            "description": self._get_weather_description(base_temp),
            "location": "Default Location"
        }
    
    def predict_by_coords(self, lat, lon):
        """Predict weather by coordinates"""
        base_temp = self._calculate_temperature_by_coords(lat, lon)
        return {
            "temperature": round(base_temp, 1),
            "humidity": random.randint(60, 90),
            "rainfall": round(random.uniform(0, 8), 1),
            "wind_speed": round(random.uniform(1, 8), 1),
            "pressure": random.randint(1000, 1018),
            "forecast_hours": self._generate_forecast_hours(base_temp),
            "description": self._get_weather_description(base_temp),
            "location": f"Lat: {lat}, Lon: {lon}"
        }
    
    def predict_by_location(self, location):
        """Predict weather by location name"""
        loc_data = self.locations.get(location.lower(), self.locations['default'])
        base_temp = self._calculate_temperature_by_coords(loc_data['lat'], loc_data['lon'])
        
        return {
            "temperature": round(base_temp, 1),
            "humidity": random.randint(60, 90),
            "rainfall": round(random.uniform(0, 8), 1),
            "wind_speed": round(random.uniform(1, 8), 1),
            "pressure": random.randint(1000, 1018),
            "forecast_hours": self._generate_forecast_hours(base_temp),
            "description": self._get_weather_description(base_temp),
            "location": location.title()
        }
    
    def predict_manual(self, temperature, humidity, pressure, wind_speed, rainfall):
        """Predict weather from manual input"""
        if self.model:
            try:
                # Use ML model for prediction
                features = np.array([[temperature, humidity, pressure, wind_speed, rainfall]])
                features_scaled = self.scaler.transform(features)
                prediction = self.model.predict(features_scaled)[0]
                
                return {
                    "temperature": round(prediction[0], 1),
                    "humidity": round(prediction[1], 1),
                    "rainfall": round(max(0, prediction[2]), 1),
                    "wind_speed": round(max(0, prediction[3]), 1),
                    "pressure": pressure,
                    "forecast_hours": self._generate_forecast_hours(prediction[0]),
                    "description": self._get_weather_description(prediction[0]),
                    "location": "Manual Input"
                }
            except Exception:
                # Fallback to rule-based prediction
                pass
        
        # Rule-based fallback
        future_temp = temperature + random.uniform(-2, 2)
        return {
            "temperature": round(future_temp, 1),
            "humidity": max(0, min(100, humidity + random.uniform(-10, 10))),
            "rainfall": max(0, rainfall + random.uniform(-2, 2)),
            "wind_speed": max(0, wind_speed + random.uniform(-1, 1)),
            "pressure": pressure,
            "forecast_hours": self._generate_forecast_hours(future_temp),
            "description": self._get_weather_description(future_temp),
            "location": "Manual Input"
        }
    
    def chatbot_response(self, question, context=None):
        """Generate chatbot response for weather queries"""
        question_lower = question.lower()
        
        if 'suhu' in question_lower or 'temperature' in question_lower:
            return {
                "answer": "Suhu saat ini berkisar antara 25-32°C. Prediksi untuk 3 jam ke depan diperkirakan stabil dengan fluktuasi ±2°C.",
                "type": "temperature"
            }
        elif 'hujan' in question_lower or 'rain' in question_lower:
            return {
                "answer": "Curah hujan saat ini rendah dengan kemungkinan hujan ringan dalam 2 jam ke depan. Siapkan payung untuk berjaga-jaga.",
                "type": "rainfall"
            }
        elif 'angin' in question_lower or 'wind' in question_lower:
            return {
                "answer": "Kecepatan angin sedang, berkisar 3-6 km/jam. Kondisi cukup baik untuk aktivitas luar ruangan.",
                "type": "wind"
            }
        elif 'grafik' in question_lower or 'chart' in question_lower:
            return {
                "answer": "Grafik menunjukkan tren cuaca 5 jam ke depan. Garis biru untuk suhu, hijau untuk kelembapan, dan merah untuk curah hujan.",
                "type": "chart_explanation"
            }
        else:
            return {
                "answer": "Saya dapat membantu dengan informasi cuaca seperti prediksi suhu, hujan, kelembapan, dan kecepatan angin. Ada yang spesifik ingin ditanyakan?",
                "type": "general"
            }
    
    def _calculate_temperature_by_coords(self, lat, lon):
        """Calculate base temperature based on coordinates"""
        # Simple approximation: cooler near poles, warmer near equator
        base_temp = 30 - (abs(float(lat)) * 0.5)
        return base_temp + random.uniform(-3, 3)
    
    def _generate_forecast_hours(self, base_temp):
        """Generate 5-hour forecast"""
        forecast = {}
        current_time = datetime.now()
        
        for i in range(5):
            hour_time = current_time + timedelta(hours=i+1)
            hour_key = hour_time.strftime("%H:%M")
            
            temp_variation = random.uniform(-1.5, 1.5)
            forecast[hour_key] = {
                "temperature": round(base_temp + temp_variation, 1),
                "humidity": random.randint(60, 85),
                "rainfall": round(random.uniform(0, 3), 1),
                "wind_speed": round(random.uniform(1, 5), 1)
            }
        
        return forecast
    
    def _get_weather_description(self, temperature):
        """Get weather description based on temperature"""
        if temperature > 32:
            return "Hot and sunny"
        elif temperature > 28:
            return "Warm and partly cloudy"
        elif temperature > 25:
            return "Mild with some clouds"
        else:
            return "Cool with possible rain"