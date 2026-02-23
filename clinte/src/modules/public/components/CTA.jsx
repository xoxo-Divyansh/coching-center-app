import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-24 px-6 bg-[#5C5C6C] text-black text-center leading-loose">
      <h2 className="text-3xl md:text-5xl font-bold">
        Digitize Your Coaching Institute Today
      </h2>

      <p className="mt-4 text-lg text-zinc-300">
        Start managing students, batches, payments and learning all in one place.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/auth/register"
          className="bg-black text-white px-10 py-3 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Get Started Now
        </Link>

        <Link
          to="/auth/login"
          className="border border-black px-10 py-3 rounded-xl font-semibold hover:bg-white/6 0 transition"
        >
          Login
        </Link>
      </div>
    </section>
  );
};

export default CTA;