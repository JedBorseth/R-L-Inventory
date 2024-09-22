import RequestSomething from "~/components/request";

export default async function Dashboard() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="flex gap-10">Theme:</div>
      Other Settings Coming Soon...
      <RequestSomething event="testing" />
    </main>
  );
  return null;
}
