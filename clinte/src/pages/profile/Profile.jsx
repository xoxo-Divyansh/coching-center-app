import useAuth from "@/hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
        <p>
          <span className="text-zinc-400">Name:</span> {user?.name}
        </p>
        <p>
          <span className="text-zinc-400">Email:</span> {user?.email}
        </p>
        <p>
          <span className="text-zinc-400">Role:</span> {user?.role}
        </p>
      </div>
    </section>
  );
};

export default Profile;
