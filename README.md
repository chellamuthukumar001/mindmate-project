# 🧠 MindMate - AI-Powered Mental Wellness Companion

A beautiful, modern web application designed to support your mental health journey through AI-powered conversations, mood tracking, and wellness tools.

![MindMate Banner](https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1200&h=400&fit=crop)

## ✨ Features

### 🎬 **Premium Landing Page**
- Cinematic video background with mental wellness themes
- Smooth animations and glassmorphism design
- Mobile-responsive with optimized performance

### 💬 **AI Chat Companion**
- Empathetic AI conversations powered by Groq LLM
- Real-time chat with typing indicators
- Conversation history with sidebar
- Graceful offline fallback mode

### 📊 **Mood Tracking**
- Track your daily emotional state
- Visual mood history with statistics
- Trend analysis (improving/declining)
- Add notes to mood entries
- Beautiful data visualization

### 🧘 **Wellness Tools**
- **Breathing Exercises**: Guided box breathing (4-4-4 cycle)
- **Focus Mode**: Pomodoro timer for productivity
- Smooth animations and calming visuals

### 🎨 **Premium UI/UX**
- Glassmorphism cards with backdrop blur
- Calming gradient backgrounds (purple → blue → teal)
- Smooth Framer Motion animations
- Full dark mode support
- Mobile-first responsive design

## 🚀 Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend
- **Express.js** - Server framework
- **Groq API** - AI language model (llama-3.3-70b-versatile)
- **Node.js** - Runtime

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/chmuthukumar001/Mindmate.git
cd Mindmate
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

To get a Groq API key:
- Visit [https://console.groq.com](https://console.groq.com)
- Sign up for a free account
- Generate an API key

4. **Run the application**

Start the backend server:
```bash
npm run server
```

In a new terminal, start the frontend:
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:5173
```

## 🎯 Usage

### Getting Started
1. Visit the landing page at `http://localhost:5173`
2. Click "Start Your Wellness Journey" or "Chat with MindMate"
3. Explore the dashboard features

### Chat with AI
- Navigate to `/app/chat`
- Type your message and press Enter
- AI responds with empathetic, supportive guidance

### Track Your Mood
- Navigate to `/app/mood`
- Select your current mood (Happy, Sad, Anxious, etc.)
- Optionally add notes
- Click "Save Mood"
- View history and statistics

### Wellness Exercises
- **Breathing**: `/app/breathing` - Follow the expanding circle for guided breathing
- **Focus**: `/app/focus` - Use the Pomodoro timer for focused work sessions

## 📁 Project Structure

```
mindmate/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # App layout with navigation
│   │   ├── Navigation.jsx      # Bottom/top navigation bars
│   │   └── ThemeToggle.jsx     # Dark mode toggle
│   ├── pages/
│   │   ├── LandingPage.jsx     # Premium landing page
│   │   ├── HomePage.jsx        # Dashboard
│   │   ├── ChatPage.jsx        # AI chat interface
│   │   ├── MoodPage.jsx        # Mood tracking
│   │   ├── BreathingPage.jsx   # Breathing exercises
│   │   └── FocusPage.jsx       # Pomodoro timer
│   ├── App.jsx                 # Main app with routing
│   └── index.css               # Global styles
├── server.js                   # Express backend
├── package.json
└── README.md
```

## 🎨 Design Philosophy

MindMate is designed with mental wellness in mind:
- **Calming Colors**: Soft gradients of purple, blue, and teal
- **Smooth Animations**: Non-jarring, peaceful transitions
- **Glassmorphism**: Modern, elegant frosted glass effects
- **Accessibility**: High contrast, readable fonts, ARIA labels
- **Performance**: Optimized video loading, lazy rendering

## 🔒 Privacy & Security

- All mood data is stored locally or on your own backend
- API keys are protected in `.env` (never committed to git)
- No user authentication required (privacy-first)
- Works offline with fallback modes

## 🛠️ Available Scripts

```bash
npm run dev          # Start frontend dev server
npm run server       # Start backend server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Groq** for providing the AI API
- **Unsplash** & **Pixabay** for beautiful stock imagery
- **Lucide** for the icon library
- **Framer Motion** for smooth animations

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ for better mental wellness**

Visit the live demo: [Your Demo URL]
