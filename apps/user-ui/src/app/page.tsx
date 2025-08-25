import React from 'react'

const Page = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Scrollable Page</h1>
      <p className="mb-4">This is some initial content.</p>
      <div className="space-y-4">
        {[...Array(50)].map((_, i) => (
          <div key={i} className="bg-gray-200 p-4 rounded-md">
            <p>This is some dummy content to make the page scrollable. Item {i + 1}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Page
