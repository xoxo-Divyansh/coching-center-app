const Dashboards = () => {
  return (
    <section className="py-24 px-6 bg-neutral-950">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Role Based Smart Dashboards
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {[
            "Admin Dashboard",
            "Teacher Dashboard",
            "Student Dashboard",
          ].map((title) => (
            <div
              key={title}
              className="bg-neutral-900 p-8 rounded-xl border border-neutral-800"
            >
              <h3 className="text-xl font-semibold text-purple-400">{title}</h3>
              <p className="text-gray-400 mt-4">
                Fully customized tools & analytics for efficient control.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboards;
