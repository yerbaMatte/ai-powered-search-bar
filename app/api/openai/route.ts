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
        headers: {
          "Content-Type": "application/json",
        },
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

    const suggestions = aiResponse
      ? aiResponse
          .split("\n") // Split into lines
          .map(
            (line) =>
              line
                .trim() // leading/trailing whitespace
                .replace(/^-/, "") // leading dashes
                .replace(/^\d+[\).]?/, "") // leading digits with parenthesis
                .replace(/<li>|<\/li>/g, "") // Remove <li> tags
                .trim() // Trim again after removing unwanted characters
          )
          .filter((line) => line) // empty lines
      : [];

    return new Response(JSON.stringify({ query, suggestions }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch suggestions from OpenAI." }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
