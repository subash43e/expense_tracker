# Expense Tracker

A modern, full-stack expense tracking application built with **Next.js 16 App Router**, **React 19**, and **MongoDB**. Features secure JWT authentication, dark mode, budget management, and comprehensive expense analytics.

## 🚀 Tech Stack

- **Frontend**: React 19, Next.js 16 (App Router), Tailwind CSS 4
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: JWT with httpOnly cookies (XSS-safe)
- **Validation**: Zod schemas with type-safe validation
- **Charts**: Recharts for data visualization
- **State Management**: React Context API
- **Optimization**: React Compiler enabled for automatic memoization

## ✨ Features

### Next.js 16 Native Features
- **Error Boundaries**: Route-level error handling with `error.js` files
- **Loading States**: Automatic Suspense boundaries with `loading.js`
- **Not Found Pages**: Custom 404 handling with `not-found.js`
- **Middleware**: Authentication and security at the edge
- **File-Based Routing**: Intuitive folder structure for routes
- **Server Components**: Optimized data fetching and rendering

### Authentication & Security
- **Secure JWT Authentication**: httpOnly, SameSite=strict cookies (7-day expiry)
- **XSS Protection**: Tokens never exposed to JavaScript
- **Middleware Protection**: Route-level auth checks before rendering
- **Session Management**: Automatic logout on 401 responses via global event system
- **Password Validation**: Strong password requirements with real-time strength indicator

### Expense Management
- **CRUD Operations**: Create, read, update, and delete expenses
- **Smart Filtering**: Filter by category, date range, and custom query parameters
- **Pagination**: Efficient data loading with configurable page sizes
- **Sorting**: Sort by date, amount, or category
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors

### Budget & Analytics
- **Budget Tracking**: Set monthly spending limits with multi-currency support
- **Visual Analytics**: Interactive charts showing spending patterns over time
- **Category Breakdown**: See expenses grouped by category
- **Export Data**: Download expenses as CSV or JSON

### User Experience
- **Dark Mode**: System-aware dark mode with localStorage persistence
- **Responsive Design**: Mobile-first design that works on all devices
- **Accessibility**: WCAG compliant with keyboard navigation and ARIA labels
- **Toast Notifications**: Real-time feedback for user actions
- **Focus Management**: Trap focus in modals for better accessibility

## 🏗️ Project Architecture

### Directory Structure
```
expense_tracker/
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── api/               # Backend API endpoints
│   │   │   ├── auth/          # Authentication routes (login, register, me)
│   │   │   ├── budgets/       # Budget CRUD operations
│   │   │   └── expenses/      # Expense CRUD operations with handlers/
│   │   ├── analytics/         # Analytics dashboard page
│   │   ├── expenses/          # Expense management pages
│   │   ├── settings/          # User settings page
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── layout.js          # Root layout with providers
│   │   └── page.js            # Landing/Home page
│   ├── components/            # React components
│   │   ├── auth/              # Login, Register, ProtectedRoute
│   │   ├── common/            # Reusable UI (Spinner, Alert, FormField, Toast, ErrorBoundary)
│   │   ├── dashboard/         # Dashboard components (Home, AddExpense, BudgetProgress)
│   │   ├── expenses/          # Expense components (List, Filters, EditModal)
│   │   ├── analytics/         # Analytics charts and visualizations
│   │   ├── layout/            # Layout components (Sidebar, LayoutWrapper)
│   │   └── settings/          # Settings forms
│   ├── contexts/              # React Context providers
│   │   ├── AuthContext.js     # Authentication state management
│   │   ├── BudgetContext.js   # Budget state with refetch methods
│   │   └── DarkModeContext.js # Dark mode state with localStorage sync
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.js         # Authentication hook
│   │   ├── useBudget.js       # Budget hook
│   │   └── useFetchExpenses.js # Expense fetching with loading states
│   ├── lib/                   # Utility functions & helpers
│   │   ├── api/               # API utilities (handleApi, ensureAuthenticated)
│   │   ├── auth.js            # JWT verification helpers
│   │   ├── authFetch.js       # Client-side fetch wrapper with credentials
│   │   ├── db.js              # MongoDB connection with caching
│   │   ├── expenses.js        # Expense data access layer
│   │   ├── users.js           # User data access layer
│   │   ├── budgets.js         # Budget data access layer
│   │   └── validations.js     # Zod schemas for validation
│   └── models/                # Mongoose schemas
│       ├── User.js            # User model
│       ├── Expense.js         # Expense model
│       └── Budget.js          # Budget model
├── public/                    # Static assets
├── .github/
│   └── copilot-instructions.md # AI coding agent guidelines
├── docs/                      # Component documentation
├── next.config.mjs            # Next.js configuration (React Compiler enabled)
├── tailwind.config.js         # Tailwind CSS configuration
└── jsconfig.json              # Path aliases (@/* → src/*)
```

### Key Architectural Patterns

#### Provider Hierarchy
All pages are wrapped with providers in this specific order (see `src/app/layout.js`):
```
DarkModeProvider → AuthProvider → BudgetProvider → ToastProvider → LayoutWrapper
```
**Never change this order** - downstream providers depend on upstream context.

#### API Handler Pattern
- Route handlers delegate to `handlers/` subfolder for separation of concerns
- All handlers wrapped with `handleApi()` for consistent error handling
- Authentication via `ensureAuthenticated(request)` which throws `ApiError` on failure
- Object ID validation via `resolveAndValidateObjectId(params)`

Example:
```javascript
// src/app/api/expenses/route.js
export async function POST(request) {
  return handleCreateExpense(request);
}

// src/app/api/expenses/handlers/createExpense.js
export async function handleCreateExpense(request) {
  return handleApi(async () => {
    const userId = ensureAuthenticated(request);
    const body = await request.json();
    const validatedData = createExpenseSchema.parse(body);
    const expense = await createExpense({ ...validatedData, userId });
    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  }, { logMessage: "POST /api/expenses error" });
}
```

#### Data Access Layer
- Never query Mongoose models directly from route handlers
- Use data access helpers in `src/lib/` (expenses.js, users.js, budgets.js)
- All helpers enforce `userId` checks for security
- Centralized MongoDB connection via `src/lib/db.js` with global caching

#### State Management
- Contexts export both provider component and custom hook
- Hooks throw error if used outside provider
- All contexts expose: `{ state, loading, error, refetch }`
- Call `context.refetch()` directly instead of using events

#### Client-Side Fetching
- Always use `authFetch()` instead of native `fetch()` for authenticated requests
- Automatically includes `credentials: "include"` for httpOnly cookies
- Emits global `auth:unauthorized` event on 401 responses
- `AuthProvider` listens for this event and clears user state

## 🚦 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB instance (local or cloud, e.g., MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/subash43e/expense_tracker.git
   cd expense_tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   
   - `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/expense_tracker` or MongoDB Atlas URI)
   - `JWT_SECRET`: A secure random string for JWT signing (generate with `openssl rand -base64 32`)

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create production build
- `npm run start` - Start production server (requires build first)
- `npm run lint` - Run ESLint to check code quality

## 🔑 Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/expense_tracker` |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-key-min-32-chars` |

The application will crash on startup if these are missing, with a helpful error message.

## 📖 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (sets httpOnly cookie)
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout user (clears cookie)

### Expense Endpoints

- `GET /api/expenses` - Get all expenses (supports pagination, filtering, sorting)
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/[id]` - Get single expense
- `PUT /api/expenses/[id]` - Update expense
- `DELETE /api/expenses/[id]` - Delete expense
- `DELETE /api/expenses/deleteAll` - Delete all user expenses

### Budget Endpoints

- `GET /api/budgets` - Get user budget
- `POST /api/budgets` - Create budget
- `PUT /api/budgets` - Update budget
- `DELETE /api/budgets` - Delete budget

All endpoints require authentication (except register/login) via httpOnly cookie.

## 🎨 UI Components

### Reusable Components (`src/components/common/`)

- **`Spinner`** - Loading indicator with inline/fullscreen variants
  - Variants: `inline`, `fullscreen`
  - Sizes: `sm`, `md`, `lg`
  - Colors: `white`, `indigo`, `blue`, `gray`

- **`Alert`** - Success/error messages
  - Types: `success`, `error`
  - Optional icon with `showIcon` prop

- **`FormField`** - Form input with validation
  - Types: `text`, `select`, `textarea`, `number`, `date`
  - Variants: `compact`, `spacious`
  - Built-in error display and dark mode support

- **`Toast`** - Toast notifications via `ToastProvider`

## 📚 Documentation

- **[Next.js Features Guide](./docs/NEXTJS_FEATURES.md)** - Comprehensive guide to Next.js 16 features used in this project
  - Error boundaries (`error.js`, `global-error.js`)
  - Loading states (`loading.js`)
  - Not found pages (`not-found.js`)
  - Middleware for authentication
  - File-based routing conventions
  - Best practices and migration guide

## 🧪 Development Guidelines

### Next.js Conventions
- Use `error.js` for route-level error boundaries (not custom ErrorBoundary components)
- Add `loading.js` for routes with async data fetching
- Use `notFound()` function for 404 responses
- Implement middleware for auth checks and security headers
- Follow file-based routing conventions

### Code Style
- Use PropTypes for component prop validation
- Define PropTypes at bottom of component files
- Icon components must be defined at module scope (React Compiler requirement)
- Avoid manual `useCallback`/`memo` - React Compiler handles it automatically

### State Management
- Use contexts (`useAuth`, `useBudget`, `useDarkMode`) instead of prop drilling
- Call `context.refetch()` after mutations instead of manual state updates
- Never use contexts outside their provider

### API Development
- Delegate route handlers to `handlers/` subfolder
- Wrap all handlers with `handleApi()` for consistent error handling
- Use `ensureAuthenticated(request)` for protected routes
- Validate with Zod schemas from `src/lib/validations.js`
- Use data access helpers instead of direct model queries

### Security Best Practices
- Always use `authFetch()` for client-side authenticated requests
- Never expose JWT tokens to JavaScript (httpOnly cookies only)
- All data access helpers enforce `userId` checks
- Validate all inputs with Zod before database operations

## 🐛 Troubleshooting

### Common Issues

**"Missing required environment variables" error**
- Ensure `.env.local` exists and contains `MONGODB_URI` and `JWT_SECRET`
- Restart dev server after adding env variables

**MongoDB connection fails**
- Check MongoDB is running (if local)
- Verify connection string format and credentials
- Ensure IP is whitelisted (if using MongoDB Atlas)

**401 Unauthorized errors**
- Check if user is logged in
- Clear cookies and re-login
- Verify `authFetch()` is used instead of native `fetch()`

**Dark mode not persisting**
- Check browser localStorage is enabled
- Clear localStorage and try again

## 📝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and patterns
- Add PropTypes to all components
- Update documentation for new features
- Test authentication flows thoroughly
- Ensure dark mode works correctly

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI powered by [Tailwind CSS](https://tailwindcss.com/)
- Charts by [Recharts](https://recharts.org/)
- Icons from [React Icons](https://react-icons.github.io/react-icons/)


