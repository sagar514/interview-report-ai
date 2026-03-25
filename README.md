# Interview Report Generator (GenAI)

- Generate interview reports using Google's Gemini AI
- Get match score, technical/behavioral questions, skill gaps, and preparation plan
- MERN + Gemini AI

## Setup for frontend
npm install
npm run dev

## Setup for backend
npm install
npx nodemon server

## Configure DB cluster, create database

### Create .env file in backend folder
PORT=*****
MONGO_URI=*****
JWT_SECRET=*****
GOOGLE_GENAI_API_KEY=*****
GEMINI_AI_MODEL=gemini-3-flash-preview
