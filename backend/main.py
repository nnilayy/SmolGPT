# main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from chat_langchain import ChatHandler

app = FastAPI()


chathandler = ChatHandler(ChatModel='ChatGoogleGenerativeAI', model_name='gemini-1.5-pro')
# In-memory storage for model settings
model_settings = {
    "ChatClass": None,
    "model_api_name": None
}

# Initialize chathandler with default settings
# You may provide default values or handle None values within ChatHandler
# chathandler = ChatHandler()

# Allow CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define models
class Message(BaseModel):
    sender: str
    text: str

# In-memory "database" to store messages
messages = []

# In-memory storage for API keys
api_keys = []

class ModelSettings(BaseModel):
    ChatClass: str
    model_api_name: str

# Endpoint to save model settings
@app.post("/save_model_settings")
def save_model_settings(settings: ModelSettings):
    global model_settings, chathandler
    model_settings['ChatClass'] = settings.ChatClass
    model_settings['model_api_name'] = settings.model_api_name
    print(f"Received model settings: {model_settings}")

    # Re-initialize chathandler with new model settings
    chathandler = ChatHandler(ChatModel=settings.ChatClass, model_name=settings.model_api_name)
    return {"status": "Model settings saved successfully"}

# Endpoint to retrieve model settings
@app.get("/get_model_settings")
def get_model_settings():
    return model_settings

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI backend!"}

@app.get("/messages")
def get_messages():
    return messages

@app.post("/messages")
def add_message(message: Message):
    messages.append(message)
    return {"status": "Message added"}

# APIKey model
class APIKey(BaseModel):
    name: str
    value: str

# Endpoint to save API keys
@app.post("/save_api_keys")
def save_api_keys(keys: List[APIKey]):
    global api_keys
    api_keys = keys  # Replace the existing keys
    print(f"Received {len(api_keys)} API keys.")
    return {"status": "API keys saved successfully"}

# Endpoint to retrieve API keys
@app.get("/get_api_keys")
def get_api_keys():
    return api_keys

# Update ChatRequest model to include files
class ChatRequest(BaseModel):
    message: str
    files: Optional[List[str]] = None  # List of filenames

# /chat endpoint
@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    user_message = request.message
    user_files = request.files  # List of uploaded filenames
    ai_response = chathandler.chat(user_message)
    return {"response": ai_response}

# Upload endpoint
@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="You can only upload up to 10 files at a time")
    try:
        os.makedirs("temporary_folder", exist_ok=True)
        uploaded_files = []
        for file in files:
            file_path = f"temporary_folder/{file.filename}"
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            uploaded_files.append(file.filename)
        return {"filenames": uploaded_files, "status": f"{len(uploaded_files)} file(s) uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
