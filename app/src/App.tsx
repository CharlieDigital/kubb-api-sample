import './App.css'
import PostsTable from './components/PostsTable'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Hono + React Posts App
        </h1>
        <PostsTable />
      </div>
    </div>
  )
}

export default App
