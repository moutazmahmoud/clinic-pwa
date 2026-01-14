# Clinic PWA 🏥

A modern, multi-role Clinic Management Progressive Web Application (PWA) built with **Next.js**, **Supabase**, and **Tailwind CSS**. This application provides a seamless experience for patients to book appointments and for clinics/admins to manage them efficiently.

## 🚀 Key Features

- **Multi-Role Dashboards**:
  - **Patient**: Search for clinics, book appointments, and view personal health records/history.
  - **Clinic**: Manage appointment schedules, update clinic profiles, and handle patient bookings.
  - **Admin**: Oversee the entire system, manage clinics, patients, and system-wide settings.
- **Progressive Web App (PWA)**: Installable on mobile and desktop devices with offline support.
- **Internationalization (i18n)**: Full support for multiple languages and RTL (Right-to-Left) layouts.
- **Real-time Backend**: Powered by Supabase for authentication, real-time database updates, and Row-Level Security (RLS).
- **Responsive Design**: Mobile-first approach using Tailwind CSS for a premium, accessible UI.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend & Auth**: [Supabase](https://supabase.com/)
- **i18n**: [next-intl](https://next-intl-docs.vercel.app/)
- **PWA**: [@ducanh2912/next-pwa](https://github.com/ducanh2912/next-pwa)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```bash
├── app/               # Next.js App Router (i18n localized routes)
├── components/        # Reusable UI, Layout, and Feature components
├── i18n/              # Internationalization configuration
├── lib/               # Shared utilities (Supabase client, auth helpers)
├── messages/          # Translation JSON files (en/ar)
├── public/            # Static assets and PWA manifest
└── supabase/          # Database schema and migrations
```

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd clinic-pwa
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is private and intended for clinic management efficiency.
