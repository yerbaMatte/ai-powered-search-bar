import SearchBar from "@/components/ui/SearchBar/SearchBar";
import Suggestions from "@/components/ui/Suggestions/Suggestions";

export default async function Home({
  searchParams,
}: {
  searchParams: { query: string };
}) {
  const { query } = await searchParams;

  return (
    <div className="w-full grow flex flex-col gap-y-1 m-auto justify-center items-center max-w-[500px]">
      <SearchBar />
      <Suggestions query={query} />
    </div>
  );
}
