import React from "react";

export default function Hero() {
  return (
   
      <section className="min-h-[90vh] flex items-center bg-background text-forground">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-heading font-bold">
              One Platform for Learning & Teaching
            </h1>

            <p className="text-lg text-muted-foreground">
              Discover courses, manage students, and grow your coaching
              institute with a modern and simple platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/register?role=student"
                className="px-6 py-3 rounded-lg bg-primary text-white text-center hover:opacity-90 transition"
              >
                🎓 I’m a Student
              </a>

              <a
                href="/register?role=teacher"
                className="px-6 py-3 rounded-lg border border-primary text-primary text-center hover:bg-primary hover:text-white transition"
              >
                🧑‍🏫 I’m a Teacher
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="hidden md:block">
            <div className="w-full h-80 rounded-xl bg-surface flex items-center justify-center">
              <span className="text-muted-foreground">
                Illustration / Preview
              </span>
            </div>
          </div>
        </div>
      </section>
    
  );
}
