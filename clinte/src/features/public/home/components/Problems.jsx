const problems = [
  "Manual Attendance & Registers",
  "Excel-based Fee Tracking",
  "WhatsApp for Notes Sharing",
  "No Centralized Student Dashboard",
  "Payment Confusion",
  "Zero Student Analytics",
];

const Problems = () => {
  return (
    <section className="py-24 px-6 bg-neutral-950">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Problems Coaching Institutes Face Daily
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {problems.map((item, i) => (
            <div
              key={i}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-6"
            >
              <p className="text-gray-300">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problems;
