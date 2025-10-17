# 🤖 DigiSaathi

**AI-Powered Financial Companion for India**

DigiSaathi is an intelligent financial assistant designed to empower Indian users with AI-driven insights for managing their finances. From expense tracking and fraud detection to document analysis and personalized financial guidance, DigiSaathi makes financial management simple, secure, and accessible.

---

## ✨ Features

- **💬 AI Chat Assistant**: Interactive chatbot powered by Google Gemini for financial queries and guidance
- **📊 Expense Analysis**: Smart expense tracking and categorization with visual insights
- **🔍 Fraud Detection**: Real-time transaction monitoring and fraud alerts
- **📄 Document Analysis**: OCR-powered document scanning and analysis (bills, receipts, invoices)
- **👤 KYC Management**: Secure Know Your Customer verification and document management
- **💰 Payment Integration**: Seamless payment processing and transaction history
- **📈 Dashboard Analytics**: Comprehensive financial overview with charts and insights
- **🌐 Multi-language Support**: Support for multiple Indian languages
- **🎓 Financial Education**: Resources and guidance for financial literacy
- **🌙 Dark Mode**: Modern UI with light/dark theme support

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **AI/ML**: Google Gemini AI, LangChain
- **OCR**: Tesseract, Pillow
- **Database**: PostgreSQL (via SQLAlchemy)
- **Authentication**: JWT (python-jose), Argon2 password hashing
- **Server**: Uvicorn, Gunicorn

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Chart.js, Recharts
- **Animations**: Motion
- **Notifications**: Sonner

### DevOps
- **Containerization**: Docker, Docker Compose
- **Development**: Hot reload for both frontend and backend

---

## 📁 Project Structure

```
DigiSaathi/
├── backend/                  # FastAPI backend application
│   ├── app/
│   │   ├── api/             # API endpoints and dependencies
│   │   ├── core/            # Configuration and security
│   │   ├── schemas/         # Pydantic models
│   │   └── services/        # Business logic services
│   ├── db/                  # Database session and CRUD operations
│   ├── models/              # SQLAlchemy models
│   ├── main.py              # Application entry point
│   └── requirements.txt     # Python dependencies
├── frontend/                # Next.js frontend application
│   ├── src/
│   │   ├── app/            # Next.js pages and routes
│   │   ├── components/     # React components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── services/       # API service clients
│   └── package.json        # Node dependencies
├── docker-compose.yml      # Docker composition
├── Dockerfile              # Docker image configuration
└── README.md              # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.8+ (for backend)
- **Node.js** 18+ and npm/yarn (for frontend)
- **PostgreSQL** database
- **Tesseract OCR** (for document analysis)
- **Google Gemini API Key** (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sumitsingh3072/DigiSaathi.git
   cd DigiSaathi
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```

### Environment Variables

#### Backend (.env in backend directory)
Create a `.env` file in the `backend` directory:

```env
# Application
PROJECT_NAME=DigiSaathi
API_V1_STR=/api/v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/digisaathi

# Security
SECRET_KEY=your-secret-key-here-change-in-production

# AI Services
GEMINI_API_KEY=your-gemini-api-key-here
```

#### Frontend (.env.local in frontend directory)
Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Running the Application

#### Option 1: Run Locally

**Backend** (from project root):
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend** (from project root):
```bash
cd frontend
npm run dev
# or
yarn dev
```

#### Option 2: Using Docker Compose (recommended)
```bash
docker-compose up --build
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 📚 API Documentation

Once the backend is running, you can access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main API Endpoints

- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/users/me` - Get current user
- `POST /api/v1/chat/messages` - Send chat message
- `POST /api/v1/documents/upload` - Upload document
- `POST /api/v1/ocr/analyze` - Analyze document with OCR
- `POST /api/v1/fraud/check` - Check transaction for fraud
- `GET /api/v1/dashboard/summary` - Get dashboard data
- `POST /api/v1/transactions` - Create transaction
- `GET /api/v1/transactions` - List transactions

---

## 💡 Usage

1. **Register/Login**: Create an account or log in to access features
2. **Dashboard**: View your financial overview, recent transactions, and insights
3. **Chat Assistant**: Ask questions about finance, budgeting, or get personalized advice
4. **Upload Documents**: Scan bills, receipts, or invoices for automatic data extraction
5. **Track Expenses**: Monitor your spending patterns and get categorized insights
6. **Fraud Detection**: Check suspicious transactions before proceeding
7. **KYC Verification**: Complete your profile with secure document verification

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

---

## 📧 Contact

**Project Owner**: [sumitsingh3072](https://github.com/sumitsingh3072)

**Repository**: [https://github.com/sumitsingh3072/DigiSaathi](https://github.com/sumitsingh3072/DigiSaathi)

---
