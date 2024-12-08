import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase();

  if (!query) {
    return new Response(
      JSON.stringify({ error: "Query parameter is required." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (query.length < 2 || query.length > 32) {
    return new Response(
      JSON.stringify({
        error: "Query must be between 2 and 32 characters.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Provide 8 concise autocomplete suggestions for the input: "${query}".`,
        },
      ],
    });

    const aiResponse = completion.choices[0].message?.content;

    const sanitizeSuggestion = (line: string) =>
      line
        .trim()
        .replace(/^-/, "")
        .replace(/^\d+[\).]?/, "")
        .replace(/<li>|<\/li>/g, "")
        .trim();

    const suggestions = aiResponse
      ? aiResponse.split("\n").map(sanitizeSuggestion).filter(Boolean)
      : [];

    return new Response(JSON.stringify({ query, suggestions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error calling OpenAI API:", {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });

    return new Response(
      JSON.stringify({ error: "Failed to fetch suggestions from OpenAI." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
