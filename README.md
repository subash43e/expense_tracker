
# 🌟 Expense Tracker — A Little App That Keeps Your Wallet Happy

I’ve always wanted a simple, clean, and actually *useful* way to understand where my money goes every month… so I built one.

**Expense Tracker** is my modern full-stack app built with **Next.js 16**, **React 19**, and **MongoDB** — but more importantly, it’s an app that helps you take control of your spending without feeling overwhelmed.

Think of it like a digital notebook for your money… but smarter. 😎

---

## ✨ Why I Built This

Managing monthly expenses usually means:

* random notes in Google Keep
* forgotten UPI screenshots
* Excel sheets you create enthusiastically once and never use again

So I created this app to make money tracking **simple**, **visual**, and **enjoyable**.

---

## 🚀 What’s Inside (in normal-human language)

### 💸 Track Your Expenses Easily

Add your expenses, edit them, delete them when you regret buying that extra pizza — you know the drill.

You can filter by:

* category
* date range
* amount
* and even sort everything how *you* like it.

It feels smooth because the UI updates instantly (optimistic updates ✨).

---

### 💰 Set Your Monthly Budget

Tell the app how much you want to spend this month.
It will do the math, watch your limits, and show beautiful charts so you actually understand your spending patterns.

---

### 📊 Beautiful Analytics

Visual breakdowns of:

* categories
* spending over time
* budgets
* monthly totals

It’s basically your financial mirror — but kinder.

---

### 🔐 Built-In Security (because your data matters)

* JWT auth using **httpOnly cookies**
* No token leaks
* Route protection through Next.js middleware
* Session auto-logout on invalid tokens

You log in once and everything else happens quietly in the background.

---

### 🌙 Dark Mode Because… Why Not?

I mean, everything looks cooler in dark mode.
It remembers your preference too.

---

## 🧩 What Powers the App (for the tech lovers)

**Frontend:** React 19, Next.js 16 App Router
**Backend:** Next.js API Routes + MongoDB
**Styling:** Tailwind CSS
**Charts:** Recharts
**Validation:** Zod
**State:** Context API
**Extras:** React Compiler is enabled for automatic optimizations 🚀

---

## 📁 Project Structure (super simplified)

```
src/
  app/        # pages + API routes
  _components/ # UI components
  _contexts/   # auth, budgets, dark mode
  _hooks/      # custom hooks
  _lib/        # db + helpers + utils
  models/      # mongoose models
```

Nothing fancy — just clean, organized folders that make sense.

---

## 🛠️ Running It Locally

```bash
git clone https://github.com/subash43e/expense_tracker.git
cd expense_tracker
npm install
```

Create a `.env.local`:

```
MONGODB_URI=your_mongo_url
JWT_SECRET=your_secret_key

```

Start the dev server:

```bash
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** and you're in.

---

## 🎨 A Peek at the UI Components

Reusable stuff like:

* Spinners
* Alerts
* Toasts
* Form fields
* Dark mode toggle
* Sidebar

Everything designed to look clean and modern.

---

## 🧭 Developer Notes (things I follow religiously)

* Route-level `error.js` instead of custom ErrorBoundary components
* Never fetch without `authFetch()`
* All database functions live in `/lib`, not inside routes
* All requests validated with Zod
* Providers follow a strict hierarchy
* Contexts are the first-class citizens here

---

## 🛑 Troubleshooting (aka "Why is this not working!?")

**Mongo not connecting?**
Check your URI or whitelist IP in MongoDB Atlas.

**401 errors everywhere?**
Log in again — your token probably expired.

**Dark mode doesn’t stick?**
Clear localStorage once.

---

## 🤝 Contributing

If you want to play around, improve something, or fix a bug:

```bash
git checkout -b feature/new-idea
git commit -m "Add new idea"
git push origin feature/new-idea
```

Then open a PR!

---

## 📄 License

MIT — do whatever you want, just don’t blame me if your wallet cries. 😄

---

## 🙏 Thanks for Reading

This project is something I genuinely enjoyed building — a mix of design, simplicity, and real-world usefulness.

If you try it out, let me know what you think!
