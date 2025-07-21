# Young Festival 2025 - Roata Norocului

A modern prize wheel web application built with React, TypeScript, and Socket.io for real-time communication between mobile devices and big screen displays.

## Features

- **Mobile Registration**: Age-gated participant registration with data collection
- **Real-time Prize Wheel**: Animated SVG wheel with probability-based prize selection
- **Daily Stock Management**: Automatic stock limits and midnight reset
- **Live Communication**: Socket.io integration for phone-to-display synchronization
- **Admin Panel**: Protected export functionality for participant data
- **Production Ready**: Dockerized deployment with Nginx

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Animation**: Framer Motion for smooth wheel rotations
- **Real-time**: Socket.io for live communication
- **Storage**: localStorage for client-side state management
- **Deployment**: Docker + Nginx for production

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser:
   - Registration: `http://localhost:3000/spin`
   - Display: `http://localhost:3000/display` (password: `festival2025`)
   - Admin: `http://localhost:3000/admin/export` (password: `admin2025`)

## Production Build

### Build Locally

```bash
npm run build
```

### Docker Build

```bash
docker build -t festival-prize-wheel .
docker run -p 80:80 festival-prize-wheel
```

## Coolify Deployment

### Requirements

- Coolify instance
- Domain: `tombola.cristalsrl.ro`

### Setup Steps

1. **Create New Project** in Coolify
2. **Set Repository**: Connect to your Git repository
3. **Configuration**:
   - Build Command: `npm run build`
   - Port: `80`
   - Domain: `tombola.cristalsrl.ro`
4. **Deploy**: Coolify will automatically build and deploy

### Environment

- **Domain**: `https://tombola.cristalsrl.ro`
- **HTTPS**: Automatically handled by Traefik
- **Port**: 80 (internal container port)

## Prize Configuration

The application includes 7 prizes with different rarities:

- **Rare** (Green): 5 prizes, 8-12 daily stock each
- **Epic** (Violet): 1 prize, 8 daily stock
- **Legendary** (Gold): 1 prize, 1 daily stock

### Special Rules

- Legendary prize cannot be won on the first spin of the day
- Minimum 10 spins required before legendary becomes available
- Daily stock automatically resets at midnight

## Usage

### For Participants

1. Scan QR code or visit `/spin`
2. Fill registration form (18+ age gate required)
3. Accept newsletter consent
4. Wait for turn and watch big screen
5. if prenume = "rov", infinite spins + no validation

### For Operators

1. Open `/display` on big screen
2. Enter password: `festival2025`
3. Monitor live stock and wheel animations

### For Admins

1. Visit `/admin/export`
2. Enter password: `admin2025`
3. Download participant data as JSON

## Security Features

- Password protection for display and admin pages
- Age verification (18+)
- Concurrency protection (no simultaneous spins)
- Input validation and sanitization
- HTTPS enforcement in production

## File Structure

```
src/
├── components/          # React components
├── pages/              # Page components
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── App.tsx            # Main application

server.js              # Socket.io server
Dockerfile            # Docker configuration
nginx.conf            # Nginx configuration
```

## Support

For technical issues or questions, please check the documentation or contact the development team.

---

**Young Festival 2025** - Powered by modern web technologies