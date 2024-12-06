import { countries } from "@/lib/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase() || "";

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().startsWith(query)
  );

  return new Response(JSON.stringify(filteredCountries), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
