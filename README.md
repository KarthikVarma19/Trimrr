
# Full Stack React JS URL Shortener Project

A comprehensive full stack URL shortener app built with ReactJS, Tailwind CSS, Supabase, and Shadcn UI, featuring authentication, URL shortening, analytics tracking, QR code generation, and image uploads.

## Installation

Follow these steps to set up the project locally:

### Prerequisites

- Node.js and npm installed
- Supabase account and project created
- Hostinger account (optional for deployment)

### Setup Steps

1. Create a new React app with JavaScript template:

```bash
npm create vite@latest
# Choose React and JavaScript options
```

2. Install dependencies:

```bash
npm install
npm install @supabase/supabase-js react-router-dom tailwindcss shadcn-ui react-spinners yup
```

3. Initialize Tailwind CSS:

```bash
npx tailwindcss init -p
```

4. Install Shadcn UI components:

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button accordion input tabs card avatar dropdown
```

5. Set up Supabase:

- Create a Supabase project
- Create tables: `URLs` and `Clicks` with appropriate columns and row-level security policies
- Create storage buckets for profile pictures and QR codes with proper access policies
- Copy your Supabase URL and API key into a `.env` file as environment variables

6. Configure React Router and app layout

7. Run the app locally:

```bash
npm run dev
```

## Usage

- Enter a long URL on the landing page to shorten it
- Sign up or log in to manage your URLs
- View analytics including clicks, device types, and locations
- Download QR codes for your shortened URLs
- Copy, delete, or customize your short URLs

## Deploy

- Build the project for production:

```bash
npm run build
```

- Upload the `dist` folder contents to your hosting provider (e.g., Hostinger)
- Add `.htaccess` file with proper rewrite rules for React routing
- Connect your domain and ensure SSL is enabled

## Technologies

- **ReactJS** - Frontend UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - React component library built on Tailwind
- **Supabase** - Backend as a service with PostgreSQL database, authentication, and storage
- **React Router DOM** - Client-side routing
- **Yup** - Form validation
- **React Spinners** - Loading indicators



## Contributing

- Fork the repository
- Clone your fork locally
- Create a feature branch
- Make changes and commit
- Push to your fork and create a pull request

## Documentation

More detailed documentation can be found at the Supabase docs, React docs, and Tailwind CSS official sites.

## Acknowledgments

- Supabase team for backend services
- Tailwind Labs for Tailwind CSS
- Shadcn UI contributors

## License

Refer to the [Choose a License](https://choosealicense.com/) page for license agreements.
```
This README.md format includes installation, usage, deployment, technologies, database schema, contributing, documentation, acknowledgments, and license sections reflecting the full stack URL shortener project from the tutorial.# Trimrr
