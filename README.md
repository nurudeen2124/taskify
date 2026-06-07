# Taskify

A beautiful full-stack task management application with a dark space-themed design, built with Next.js 16, Prisma, and Tailwind CSS.

## Features

- **Task Management** - Create, edit, delete, and track tasks with priorities and categories
- **Note Taking** - Quick notes with create, edit, and delete functionality
- **Task Sharing** - Share your task lists with others via email or link
- **Dark Space Theme** - Stunning animated starfield with glass-morphism UI
- **Responsive Design** - Works seamlessly across desktop and mobile devices
- **Real-time Stats** - Track your productivity with live statistics

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** SQLite (via Prisma)
- **Icons:** Lucide React
- **Notifications:** Sonner

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm or bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/nbt2124/taskify.git
cd taskify

# Install dependencies
npm install

# Set up the database
npx prisma generate
npx prisma db push

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
taskify/
├── prisma/
│   └── schema.prisma        # Database schema (Task & Note models)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── tasks/       # Task CRUD API routes
│   │   │   └── notes/       # Note CRUD API routes
│   │   ├── globals.css      # Global styles & animations
│   │   ├── layout.tsx       # Root layout with theme provider
│   │   └── page.tsx         # Main dashboard page
│   └── components/
│       └── ui/              # shadcn/ui components
├── package.json
└── tailwind.config.ts
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| POST | /api/tasks | Create a new task |
| PUT | /api/tasks/[id] | Update a task |
| DELETE | /api/tasks/[id] | Delete a task |
| GET | /api/notes | Get all notes |
| POST | /api/notes | Create a new note |
| PUT | /api/notes/[id] | Update a note |
| DELETE | /api/notes/[id] | Delete a note |

## License

MIT
