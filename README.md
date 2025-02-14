## Features

- 🔐 JWT Authentication
- 📦 MongoDB Database
- 🔒 Secure Password Hashing
- 🪝 Webhook Support
- ✨ TypeScript Support

## Prerequisites

- Node.js 16.x or later
- MongoDB installed locally or a MongoDB Atlas connection string
- npm or yarn package manager

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
WEBHOOK_SECRET=your_webhook_secret
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
  - Body: `{ email: string, password: string }`
  - Returns: JWT token

### Users
- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/[id]` - Get user by ID (requires authentication)
- `POST /api/users` - Create new user
  - Body: `{ name: string, email: string, password: string }`

### Webhooks
- `POST /api/webhook` - Receive webhook events
  - Requires `x-webhook-signature` header
  - Body: `{ eventType: string, data: object }`

## Development

The project uses:
- Next.js 15 with App Router
- MongoDB with Mongoose ODM
- Zod for validation
- JWT for authentication

## Building for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Webhook signature verification
- MongoDB connection security
- Input validation using Zod