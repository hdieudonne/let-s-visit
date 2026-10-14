import { auth, signOut } from "@/auth";

export default async function PlacesPage() {
  const session = await auth();

  return (
    <main className="mx-auto mt-16 max-w-xl p-4">
      <h1 className="text-2xl font-bold">Places (coming soon)</h1>
      {session?.user ? (
        <>
          <p className="mt-4">
            Logged in as {session.user.name} ({session.user.role})
          </p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button className="mt-4 rounded bg-black px-4 py-2 text-white">
              Log out
            </button>
          </form>
        </>
      ) : (
        <p className="mt-4">Not logged in.</p>
      )}
    </main>
  );
}