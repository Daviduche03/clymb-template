import { db } from '@/db';
import { users as usersTable } from '@/db/schema';
import { UserForm } from '@/components/user-form';
import { 
  Users, 
  Mail, 
  Calendar, 
  ChevronRight,
  User as UserIcon 
} from 'lucide-react';

export default async function Page() {
  const users = await db.select().from(usersTable);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero / Header Section */}
      <div className="relative overflow-hidden bg-white px-6 py-12 shadow-sm dark:bg-zinc-900 md:px-12 lg:py-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.950/20),theme(colors.zinc.950))]" />
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            User Management
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            A premium dashboard to manage your community, track user growth, and integrate directly with your database.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-5 md:px-12 lg:gap-12">
        {/* Left Column: Form */}
        <div className="md:col-span-2">
          <div className="sticky top-8">
            <UserForm />
            <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/30 p-6 dark:border-indigo-950/30 dark:bg-indigo-900/10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-900 dark:text-indigo-400">
                Project Ready
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-indigo-700 dark:text-indigo-300">
                Your database is connected and migrations are synced. You can now add users directly to the PostgreSQL instance.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: User List */}
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <Users className="h-6 w-6 text-indigo-500" />
              Recent Users
            </h2>
            <div className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium dark:bg-zinc-800">
              {users.length} {users.length === 1 ? 'User' : 'Users'}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-1">
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-20 text-center dark:border-zinc-800">
                <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
                  <UserIcon className="h-8 w-8 text-zinc-400" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">No users yet</h3>
                <p className="mt-1 text-sm text-zinc-500">Fill the form on the left to add your first user.</p>
              </div>
            ) : (
              users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).map((user) => (
                <div 
                  key={user.id}
                  className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-white bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-indigo-900/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                      <UserIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{user.name}</h4>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-zinc-300 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500 dark:text-zinc-700" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
