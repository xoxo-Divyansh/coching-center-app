import useAuth from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-zinc-400">
        Welcome {user?.name || "User"} ({user?.role || "guest"}).
      </p>
    </section>
  );
};

export default Dashboard;
