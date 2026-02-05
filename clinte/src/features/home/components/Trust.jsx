import React from 'react'

const Trust = () => {
  return (
    <>
    <section className="py-20 bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat
            number="10,000+"
            label="Active Students"
          />
          <Stat
            number="500+"
            label="Courses Created"
          />
          <Stat
            number="200+"
            label="Verified Teachers"
          />
          <Stat
            number="100+"
            label="Coaching Institutes"
          />
        </div>
      </div>
    </section>
    </>
  )
}

export default Trust