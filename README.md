# VisionX

![VisionX Banner](https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop)

VisionX is an industry-grade AI-powered fashion ecosystem designed to bridge the gap between high-fidelity digital synthesis and personal style. Operating on a "Neural Synthesis" protocol, the platform provides real-time fashion diagnostics, virtual try-on studios, and a global aesthetic synchronization network.

---

## ⚡ Core_Capabilities

### 1. Neural Style Engine
Utilizes Google Gemini 1.5 Flash (with Groq Llama-3.3 fallback) to provide data-driven fashion consultations. The engine analyzes user intent and maps it to specific garment protocols.

### 2. Biometric Recommender
A high-precision scanning interface that utilizes computer vision to analyze skeletal landmarks, body proportions, and color DNA to recommend the optimal wardrobe configuration.

### 3. Virtual Try-On Studio
A production-ready studio environment for real-time garment synthesis. Features a technical HUD with live diagnostic overlays and interactive item mapping.

### 4. Global Sync Feed
A technical community dashboard where users can synchronize their aesthetic DNA, track "Style Velocity" trends, and participate in weekly synthesis challenges.

---

## 🛠️ Technology_Stack

### Frontend Architecture
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Custom Stealth-Amber Design System
- **Animations**: Framer Motion (Industrial reveal protocols)
- **UI Components**: Shadcn/UI + Lucide React (Industrial iconography)
- **State Management**: React Context (Cart/Global Sync)

### Backend & AI
- **Primary AI**: Google Gemini Pro 1.5
- **Fallback AI**: Groq (Llama-3.3-70B)
- **CV Engine**: Python / Flask (Pose measurement & landmark detection)
- **Auth**: Clerk (Neural Identity Management)

### Data Persistence
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose

---

## 🚀 Getting_Started

### Prerequisites
- Node.js 18.x or higher
- Python 3.10+ (for ML backend)
- MongoDB Connection String
- API Keys: Clerk, Gemini, Groq

### Installation_Protocol

1. **Clone the Repository**
   ```bash
   git clone https://github.com/princeyuviii/VisionX.git
   cd VisionX
   ```

2. **Frontend Initialization**
   ```bash
   npm install
   ```

3. **Backend Initialization**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=your_mongodb_uri

   # AI Services
   GEMINI_API_KEY=your_gemini_key
   GROQ_API_KEY=your_groq_key

   # Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # ML Server
   NEXT_PUBLIC_ML_SERVER_URL=http://localhost:5000
   ```

### Execution_Sequence

**Start Frontend:**
```bash
npm run dev
```

**Start ML Server:**
```bash
cd backend
python server.py
```

The platform will be live at `http://localhost:3000`.

---

## 📂 Project_Structure

```
VisionX/
├── app/                # Next.js App Router (Pages & API Routes)
├── components/         # UI Architecture
│   ├── community/      # Social & Feed components
│   ├── recommend/      # ML Analysis & Results
│   └── ui/             # Core Design System
├── config/             # Static Protocols & Fashion Data
├── context/            # Global State Management
├── lib/                # Shared Utilities & API Clients
├── models/             # Mongoose Database Schemas
├── scripts/            # Maintenance & Seed Scripts
├── types/              # Centralized TypeScript Interfaces
└── backend/            # Python ML Computer Vision Server
```

---

## 🔒 Security_&_Performance

- **Modular Architecture**: Built with feature-based components to ensure a sub-200kB bundle size for critical paths.
- **Fail-Safe AI**: Implements a primary/secondary model fallback to ensure 99.9% style engine availability.
- **Type Safety**: 100% TypeScript coverage across the fashion synthesis pipeline.

---

## 🤝 Contribution_Protocol

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AestheticUpgrade`).
3. Commit your changes (`git commit -m 'Add: Neural Glow Effect'`).
4. Push to the branch (`git push origin feature/AestheticUpgrade`).
5. Open a Pull Request.

---

**Developed by [Yuvraj Singh Rathore](https://github.com/princeyuviii)** 
