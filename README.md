# 🎓 LearnLingo

A modern, responsive language learning platform that connects students with qualified teachers from around the world. Built with React, Firebase, and modern UX patterns to provide an exceptional learning experience.

![LearnLingo Preview](./public/logo.svg)

## ✨ Features

### 🔍 **Smart Teacher Discovery**

- Advanced filtering system with language, level, and price range options
- Real-time search and filter persistence
- Comprehensive teacher profiles with reviews and ratings
- Interactive teacher cards with detailed information

### 👤 **User Authentication & Personalization**

- Secure Firebase Authentication
- User registration and login with form validation
- Personalized dashboard and preferences
- Real-time authentication state management

### ❤️ **Favorites Management**

- Save favorite teachers for quick access
- Real-time favorites synchronization
- Filter and manage favorite teachers
- Persistent favorites across sessions

### 📅 **Lesson Booking System**

- Interactive booking modal with teacher information
- Form validation for booking details
- Toast notifications for booking confirmations
- Seamless booking workflow

### 🎨 **Modern UX/UI**

- Responsive design that works on all devices
- Clean, modern interface with CSS modules
- Toast notifications instead of alerts
- Keyboard accessibility (ESC key support for modals)
- Smooth animations and transitions

### 🚀 **Performance & Developer Experience**

- Built with Vite for lightning-fast development
- React 19 with modern hooks and patterns
- Optimized bundle size and performance
- Clean code architecture with reusable components

## 🛠️ Tech Stack

- **Frontend:** React 19, React Router v7
- **Authentication:** Firebase Auth
- **Database:** Firebase Firestore
- **Forms:** React Hook Form + Yup validation
- **Notifications:** React Toastify
- **Icons:** React Icons
- **Styling:** CSS Modules
- **Build Tool:** Vite
- **Code Quality:** ESLint

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/cryptmask-v1/LearnLingo.git
   cd LearnLingo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase**

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Create a `src/services/firebase.js` file with your Firebase config:

   ```javascript
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";
   import { getFirestore } from "firebase/firestore";

   const firebaseConfig = {
     // Your Firebase config
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🚀 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Deploy to Vercel

The project is configured for easy deployment to Vercel:

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project
   - Add your Firebase environment variables in Vercel dashboard
   - Deploy!

3. **Environment Variables**
   Set these in your Vercel dashboard:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

The `vercel.json` configuration ensures proper SPA routing and optimizes the deployment for React Router.

## 📁 Project Structure

```
LearnLingo/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── BookingModal/  # Lesson booking functionality
│   │   ├── FilterBar/     # Teacher filtering system
│   │   ├── Header/        # Navigation and auth
│   │   ├── LoginForm/     # User authentication
│   │   ├── Modal/         # Reusable modal component
│   │   ├── RegisterForm/  # User registration
│   │   └── TeacherCard/   # Teacher profile cards
│   ├── context/          # React Context providers
│   │   ├── AuthContext.jsx     # Authentication state
│   │   └── FavoritesContext.jsx # Favorites management
│   ├── pages/            # Page components
│   │   ├── Home/         # Landing page
│   │   ├── Teachers/     # Teacher discovery
│   │   └── Favorites/    # User's favorite teachers
│   ├── services/         # Firebase integration
│   ├── data/            # Sample data and utilities
│   └── hooks/           # Custom React hooks
└── package.json
```

## 🎯 Key Features Deep Dive

### Authentication System

- Secure user registration and login
- Form validation with detailed error messages
- Toast notifications for user feedback
- Automatic session management

### Teacher Discovery

- Filter by language (Ukrainian, English, French, German, etc.)
- Level-based filtering (A1 Beginner to C2 Proficiency)
- Price range filtering ($10-20, $20-30, $30-40, $40+)
- Real-time search with no page reloads

### Responsive Design

- Mobile-first approach
- Works seamlessly on desktop, tablet, and mobile
- Touch-friendly interface
- Optimized for various screen sizes

### Accessibility

- Keyboard navigation support
- ESC key closes all modals
- Screen reader friendly
- High contrast design elements

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Firebase for backend services
- React team for the amazing framework
- Vite for the excellent build tool
- All contributors who helped improve this project

---

Made with ❤️ by [cryptmask-v1](https://github.com/cryptmask-v1)
