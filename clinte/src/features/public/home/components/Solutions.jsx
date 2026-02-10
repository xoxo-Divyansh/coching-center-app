const modules = [
  "Student Management",
  "Batch Management",
  "Teacher Panel",
  "Fee Automation",
  "Notes Sharing",
  "Recorded Classes",
  "Attendance Tracking",
  "Smart Analytics",
];

const Solutions = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          One Platform. Complete Control.
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {modules.map((item, i) => (
            <div
              key={i}
              className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6"
            >
              <p className="text-purple-400 font-medium">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;
