const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center text-center px-6">
      <div className="max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Run Your Coaching Institute <br />
          <span className="text-purple-500">Digitally & Smartly</span>
        </h1>

        <p className="mt-6 text-gray-400 text-lg">
          Manage students, batches, fees, notes, attendance & recorded classes —
          all from a single powerful dashboard.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold">
            Get Free Demo
          </button>

          <button className="border border-purple-500 px-8 py-3 rounded-lg font-semibold hover:bg-purple-500/10">
            Register Institute
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;