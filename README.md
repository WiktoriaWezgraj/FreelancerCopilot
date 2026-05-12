# Freelancer Copilot

An intelligent web application that analyzes project briefs and generates professional estimates, including price ranges, timelines, and suggested tech stacks. Built with **React (Vite)** and **Node.js**, powered by **Google Gemini 2.5 Flash**.

---

## Features

* **AI Analysis:** Uses Google Gemini to interpret complex project requirements.
* **Instant Estimates:** Generates budget ranges and delivery timelines based on provided seniority.
* **Tech Stack Suggestions:** Automatically identifies the best tools for the specific project.
* **Professional Summaries:** Provides a concise executive summary of the project scope.

---

## Tech Stack

* **Frontend:** React.js, Vite, CSS3
* **Backend:** Node.js, Express.js
* **AI Engine:** Google Gemini 1.5 Flash API

---

## Installation & Setup

### 1. Prerequisites
* [Node.js](https://nodejs.org/) installed.
* A Google Gemini API Key. You can get one at [Google AI Studio](https://aistudio.google.com/).

### 2. Backend Setup
1.  Open your terminal and navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory and add your API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    PORT=3002
    ```
4.  Start the backend server:
    ```bash
    node server.js
    ```
    *The server will run on `http://localhost:3002`. You can verify if the server is alive by visiting `http://localhost:3002/` in your browser.*

### 3. Frontend Setup
1.  Open a **new** terminal window and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser at the URL shown in the terminal (usually `http://localhost:5173`).

---

## Usage

1.  Enter your project brief or client requirements into the text area.
2.  Select the desired seniority level and currency. ! -> in progress
3.  Click **"Analyze"**.
4.  Review the AI-generated estimate and professional summary.

---

## Security Note
The `.env` file contains sensitive information (API Keys). It is listed in `.gitignore` and should **never** be committed to public repositories. Use the provided `.env.example` as a template for new environments.
