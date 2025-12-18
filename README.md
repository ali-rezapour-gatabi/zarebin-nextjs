# Zarebin Client

A Next.js App Router frontend for a chat-first expert discovery and profile management experience. The UI is RTL (fa) and uses the IRANSans font.

## Features

- Chat experience with conversation list, streaming placeholder, and message composer
- OTP-based sign-in that sets an httpOnly `token` cookie
- Profile + expert dashboard with file uploads and structured forms
- Responsive sidebar, theming (light/dark), and toast notifications

## Tech Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS v4 + Radix UI (shadcn-style components)
- Zustand for client state, React Hook Form for forms
- Axios for API calls, Framer Motion for transitions

## Project Structure

- `app/` App Router pages, layouts, route handlers, and server actions
- `components/` UI + feature components (chat, dashboard, header)
- `store/` Zustand stores for app, chat, and user state
- `lib/` utilities and API client base URL
- `constant/` shared constants for expert flows
- `hooks/` reusable hooks
- `type/` TypeScript types
- `public/` static assets and fonts

## Routes

Pages
- `/` chat UI with sidebar and chat container
- `/sign-in` OTP sign-in flow
- `/dashboard` profile and expert management
- `/explore` expert search placeholder

API routes (Next route handlers)
- `GET /apis/auth` check for auth cookie
- `POST /apis/send-code` send OTP code
- `POST /apis/sign-in` complete OTP sign-in and set cookie
- `POST /apis/chat` mock chat response

Note: the chat store currently posts to `/api/chat` in `store/chat.ts`. Align this with `/apis/chat` or add a rewrite when wiring to a real backend.

## Server Actions

- `app/actions/update-user.ts` updates profile data and avatar via `FormData`
- `app/actions/expert-user.ts` submits expert profile data
- `app/actions/expert-get.ts` fetches expert data

These actions read the `token` cookie and forward it to the backend API.

## State Management

- `useAppStore` for theme and auth flag; persisted under `app-store`
- `useChatStore` for conversations, messages, and sendMessage flow
- `useUserStore` for role, profile, expert data, and dashboard UI state

## Styling and Theming

- Global styles and theme tokens live in `app/globals.css`
- IRANSans font files are served from `public/iransans_ApsRv`
- Theme toggling is controlled by `useAppStore` and the `dark` class on `document.documentElement`

## Configuration

- `NEXT_PUBLIC_API_URL` or `API_URL` for the backend base URL (defaults to `http://localhost:3002`)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
