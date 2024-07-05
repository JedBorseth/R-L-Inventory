import { getServerAuthSession } from "~/server/auth";

export default async function Dashboard() {
  const session = await getServerAuthSession();
  if (session)
    return (
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <p>Hey Man this is the home page</p>
      </main>
    );
  else
    return (
      <div className="grid h-screen place-items-center text-center text-3xl">
        <a href="../">
          You are not logged in. <br /> Return?
        </a>
      </div>
    );
}
