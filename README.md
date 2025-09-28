# Marketplace Mobile App

A React Native mobile application built with Expo for a marketplace platform, following the design specifications from the challenge.

## Features

### Authentication
- ✅ User registration with image upload
- ✅ User login with email and password
- ✅ Secure token storage using Expo SecureStore
- ✅ Form validation with React Hook Form and Zod

### Product Management
- ✅ Product listing with image, title, and price
- ✅ Product search functionality
- ✅ Advanced filtering by category, price range
- ✅ Product detail view with full information
- ✅ Product views metric (last 7 days)

### User Profile
- ✅ User profile management
- ✅ Update personal information
- ✅ Change password with confirmation
- ✅ Profile picture upload

### Communication
- ✅ WhatsApp integration for seller contact
- ✅ Direct messaging through WhatsApp

### Navigation
- ✅ Tab-based navigation (Products/Profile)
- ✅ Stack navigation for authentication and product details
- ✅ Deep linking support

## Technologies Used

- **Expo** - Development platform
- **Expo Router** - File-based routing
- **GluestackUI** - Component library with theming
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React Native** - Icons
- **Expo Image Picker** - Image selection
- **Expo Secure Store** - Secure token storage
- **Expo Linking** - Deep linking and external URLs

## Design System

The app follows a consistent design system with:

### Colors
- **Orange**: `#F24D0D` (primary), `#C43C08` (dark)
- **Blue**: `#D7EFF9` (light), `#5EC5FD` (base), `#009CF0` (dark)
- **Background**: `#FBF4F4` (main), `#F5EAEA` (shape)
- **Grayscale**: `#ADADAD` to `#1D1D1D`
- **Semantic**: `#DC3545` (danger), `#28A745` (success)

### Typography
- Consistent font sizes from 12px to 32px
- Weight variations: normal, medium, semibold, bold

### Spacing
- Consistent spacing scale: 4px, 8px, 16px, 24px, 32px, 48px, 64px

## API Integration

The app integrates with the provided marketplace API:
- **Base URL**: `https://rocketseat-mba-marketplace.herokuapp.com`
- **Authentication**: JWT token-based
- **Endpoints**: Login, Register, Products, User Profile

### Test Credentials
- **Email**: `seller@mba.com`
- **Password**: `123456`

## Project Structure

```
app/
├── (auth)/           # Authentication screens
│   ├── login.tsx
│   └── register.tsx
├── (tabs)/           # Tab navigation screens
│   ├── index.tsx     # Home/Products
│   └── profile.tsx   # User profile
├── product/
│   └── [id].tsx      # Product detail
├── _layout.tsx       # Root layout
└── index.tsx         # Entry point

services/
├── auth.ts           # Authentication API
├── products.ts       # Products API
└── user.ts           # User API

components/           # Reusable components
lib/                  # Utilities and helpers
types/                # TypeScript definitions
utils/                # Helper functions
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (or Expo Go app)

### Installation

1. Clone the repository:
```bash
git clone git@github.com:wellmota/desafio-pratico-mobileapp.git
cd desafio-pratico-mobileapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

## Features Implementation

### Authentication Flow
1. **Splash Screen** → Check authentication status
2. **Login/Register** → Authenticate user
3. **Main App** → Access protected features

### Product Browsing
1. **Home Screen** → View all products in grid
2. **Search** → Filter products by text
3. **Filter Modal** → Advanced filtering options
4. **Product Detail** → View full product information
5. **Contact Seller** → Open WhatsApp conversation

### Profile Management
1. **Profile Tab** → View user information
2. **Edit Profile** → Update personal data
3. **Change Password** → Secure password update
4. **Logout** → Clear session and return to login

## Design Compliance

The app implements all screens from the provided Figma design:
- ✅ Splash Screen with logo
- ✅ Login Screen with form validation
- ✅ Register Screen with image upload
- ✅ Home Screen with product grid
- ✅ Filter Modal with category and price filters
- ✅ Product Detail Screen with metrics
- ✅ Profile Screen with user management

## API Documentation

The app uses the following API endpoints:
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /products` - List products with filters
- `GET /products/:id` - Get product details
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `PUT /user/password` - Update password

## Contributing

This project was created as part of a practical challenge. The codebase follows React Native and Expo best practices with proper TypeScript typing and component organization.

## License

This project is part of an educational challenge and is for demonstration purposes.
