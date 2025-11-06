import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-4 text-gray-600">Welcome to Joltibase!</p>
          
          <div className="mt-8 bg-green-50 border border-green-200 rounded-md p-4">
            <h2 className="text-lg font-semibold text-green-900">🎉 Authentication Working!</h2>
            <p className="mt-2 text-sm text-green-700">
              You're logged in as: <strong>{user.email}</strong>
            </p>
            <p className="mt-1 text-sm text-green-700">
              User ID: <code className="bg-green-100 px-2 py-1 rounded">{user.id}</code>
            </p>
          </div>

          <div className="mt-6">
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}