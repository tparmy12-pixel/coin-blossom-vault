## Digital Wallet App — Implementation Plan

### Overview

A mobile-first fintech-style wallet app with a blue/UPI-inspired theme, demo authentication, admin panel, redeem code system, and transaction history. Backend powered by Lovable Cloud (Supabase).

---

### 1. Database Setup (Lovable Cloud)

- **users** table: id, name, avatar_url, wallet_balance, created_at
- **user_roles** table: user_id, role (admin/user) — secure role-based access
- **transactions** user ken phone nomber and add to amount and click to pay button and Show to pag sacsessfull pement  table: user_id, type (credit/debit/redeem), amount, description, created_at
- **redeem_codes** table: code, reward_amount, expiry_date, max_usage, current_usage, created_by, created_at
- **redeem_usage** table: code_id, user_id, redeemed_at
- RLS policies on all tables; admin checks via `has_role()` security definer function

### 2. Demo Auth System

- Simple login screen where users pick/create a demo profile (name + avatar)
- No real email/password — session stored in localStorage
- Admin access gated by role in `user_roles` table (seed one admin user)

### 3. User Dashboard (Home)

- Large wallet balance card with animated counter (₹ format)
- Quick action buttons: Add Money, Redeem Code, History, Leaderboard
- Blue gradient UPI-inspired theme with dark mode toggle
- Profile name & avatar at top

### 4. Wallet Features

- **Add Money**: Form to add balance (in demo, self-service; admin can also add/deduct)
- **Redeem Code**: Input field → validates code against DB → shows success/invalid/expired toast with sound effect
- **Transaction History**: Scrollable list with credit (green), debit (red), redeem (gold) color coding, date/time stamps

### 5. Wallet Customization

- Theme picker (blue default, dark mode, additional accent colors)
- Editable profile name & avatar icon
- Stored per-user in the database

### 6. Admin Panel (`/admin` route)

- Protected by role check
- **Redeem Codes**: CRUD interface — create codes with name, amount, expiry, max usage
- **Users**: List all users, view balances, add/deduct balance with reason
- **Code Usage Log**: See which users redeemed which codes
- **Dashboard stats**: Total users, total balance in circulation, active codes

### 7. Leaderboard

- Top wallet users ranked by balance
- Animated podium-style display for top 3

### 8. UI/UX Details

- Mobile-first layout (optimized for ~360px width)
- Blue gradient + white cards, UPI-style icons
- Smooth fade/scale animations on navigation and actions
- Toast notifications on redeem code actions
- Sound effect (Web Audio API beep) on successful reward
- Bottom navigation bar: Home, History, Redeem, Leaderboard, Profile

### 9. Pages & Routes

- `/` — Login/profile select
- `/dashboard` — Main wallet view
- `/history` — Transaction history
- `/redeem` — Redeem code input
- `/leaderboard` — Top users
- `/profile` — Customization (theme, name, avatar)
- `/admin` — Admin panel (role-gated)