from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List
import pandas as pd
import numpy as np
from ml_model.giyu_model import GiyuWeatherModel
import json

app = FastAPI(title="Weather AI Prediction API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model
model = GiyuWeatherModel()

class ManualInput(BaseModel):
    temperature: float
    humidity: float
    pressure: float
    wind_speed: float
    rainfall: float

class ChatbotRequest(BaseModel):
    question: str
    context: Dict[str, Any] = None

@app.get("/")
async def root():
    return {"message": "Weather AI Prediction API"}

@app.get("/predict/default")
async def predict_default():
    """Get general weather prediction using default GIYU dataset values"""
    try:
        prediction = model.predict_default()
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/coords")
async def predict_by_coords(data: dict):
    """Get weather prediction by coordinates"""
    try:
        lat = data.get('lat')
        lon = data.get('lon')
        prediction = model.predict_by_coords(lat, lon)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/location-name")
async def predict_by_location(data: dict):
    """Get weather prediction by location name"""
    try:
        location = data.get('location')
        prediction = model.predict_by_location(location)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict/manual")
async def predict_manual(input_data: ManualInput):
    """Get weather prediction from manual input"""
    try:
        prediction = model.predict_manual(
            temperature=input_data.temperature,
            humidity=input_data.humidity,
            pressure=input_data.pressure,
            wind_speed=input_data.wind_speed,
            rainfall=input_data.rainfall
        )
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chatbot/ask")
async def chatbot_ask(request: ChatbotRequest):
    """Chatbot endpoint for weather-related questions"""
    try:
        response = model.chatbot_response(
            question=request.question,
            context=request.context
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)