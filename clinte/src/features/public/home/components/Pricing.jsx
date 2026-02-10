const plans = [
  { name: "Starter", price: "₹499", students: "Up to 50 students" },
  { name: "Growth", price: "₹999", students: "Up to 200 students" },
  { name: "Enterprise", price: "Custom", students: "Unlimited" },
];

const Pricing = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Simple Pricing Plans
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-neutral-900 p-8 rounded-xl border border-neutral-800"
            >
              <h3 className="text-xl font-semibold text-purple-400">
                {plan.name}
              </h3>
              <p className="text-3xl font-bold mt-4">{plan.price}</p>
              <p className="text-gray-400 mt-2">{plan.students}</p>

              <button className="mt-6 w-full bg-purple-600 py-2 rounded-lg">
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;