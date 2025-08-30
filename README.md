# 🚀 PayMe-Zar: ZAR Stablecoin Payments for Everyone

Welcome to **PayMe-Zar**, a modern Next.js 14 app for instant South African Rand (ZAR) stablecoin payments. Built with [HeroUI v2](https://heroui.com/), [Tailwind CSS](https://tailwindcss.com/), and [TypeScript](https://www.typescriptlang.org/).

---

## 🌟 Features

- **Instant ZAR Stablecoin Transfers**: Send and receive ZAR stablecoins with ease.
- **Bank Integration**: Link your bank account for deposits and withdrawals.
- **QR Code Payments**: Scan and pay or request payments via QR codes.
- **Subscription Management**: Flexible plans and easy upgrades.
- **Coupon Rewards**: Earn and claim coupons for active usage.
- **Push Notifications**: Stay updated with real-time alerts.
- **Responsive UI**: Works seamlessly on desktop and mobile.

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/paymezar-v2.git
cd paymezar-v2
```

### 2. Install Dependencies

Use your preferred package manager:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your secrets:

```bash
cp .env.local.example .env.local
```

Set up API keys, Supabase credentials, Clerk keys, etc.

### 4. Run the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to start using the app.

---

## 📱 How to Use PayMe-Zar

1. **Sign Up / Sign In**
   Create your account and set up your blockchain wallet.

2. **Send Payments**
   Go to **Pay Now** and enter recipient details or scan their QR code.

3. **Request Payments**
   Generate a QR code for others to scan and pay you.

4. **Manage Account**
   View balances, transactions, bank accounts, subscriptions, and coupons in your **Account** tab.

5. **Withdraw/Deposit**
   Link your bank account and move funds between your wallet and bank.

6. **Earn Coupons**
   Transact actively to earn coupons and claim rewards.

---

## 🧑‍💻 Developer Guide

### Project Structure

- `/app` - Next.js app directory (pages, routing)
- `/components` - UI components (cards, modals, forms, etc.)
- `/context` - React context providers
- `/hooks` - Custom React hooks
- `/lib` - Utilities, constants, helpers
- `/types` - TypeScript types and interfaces

### Adding Features

- Create new components in `/components`.
- Add new hooks in `/hooks`.
- Use context for global state.
- Follow TypeScript best practices.

### Coding Standards

- Use [HeroUI](https://heroui.com/) for UI elements.
- Write concise, readable TypeScript.
- Use Tailwind CSS for styling.
- Keep code modular and DRY.

### Running Tests

_Coming soon!_

### Troubleshooting

- **Environment Variables**: Ensure all required keys are set in `.env.local`.
- **API Issues**: Check your API base URL and keys.
- **Database**: Supabase credentials must be correct.
- **Authentication**: Clerk keys must be valid.

---

## 🤝 Contributing

1. Fork the repo and create your branch.
2. Make changes and commit.
3. Open a pull request with a clear description.

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 💬 Support & Community

- [Discord](https://discord.gg/yourdiscord)
- [Twitter](https://twitter.com/yourtwitter)
- [GitHub Issues](https://github.com/yourusername/paymezar-v2/issues)

---

**Enjoy fast, borderless ZAR payments with PayMe-Zar!**
