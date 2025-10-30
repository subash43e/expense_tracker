# Expense Tracker

This is a **Next.js 16** project for tracking expenses, featuring **MongoDB**, **JWT authentication**, and full-stack CRUD operations. It uses **React 19**, **Tailwind CSS 4**, and **Zod validation**.

## Features
- **Authentication**: Token-based JWT authentication with client-side storage.
- **Expense Management**: Add, edit, delete, and filter expenses.
- **Dark Mode**: User-configurable dark mode with system preference fallback.
- **Pagination & Filtering**: Efficient data handling with query parameters.
- **Toast Notifications**: Context-based user feedback.

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/subash43e/expense_tracker.git
   cd expense_tracker
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file in the root directory.
   - Add the following:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```

### Development
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.


## Project Structure
- `src/app/`: Contains pages and API routes.
- `src/components/`: Reusable React components.
- `lib/`: Utility functions, database connections, and validations.
- `models/`: Mongoose schemas for MongoDB.

## Contributing
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License.
