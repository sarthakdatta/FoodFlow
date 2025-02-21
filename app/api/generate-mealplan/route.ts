import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    // Extract parameters from the request body
    const { dietType, calories, proteinGoal, allergies, cuisine, snacks, variety } =
      await request.json();

    const prompt = `
      You are a professional nutritionist. Create a 7-day meal plan for an individual following a ${dietType} diet aiming for ${calories} calories and ${proteinGoal} grams of protein per day.
      Make sure the amount of calories a day is approximately the same of ${calories} and the amount of protein a day is the approximately the same of ${proteinGoal}
      If you need to reach more calories, use ingredients with higher calorie count such as rice and carbs. 
      If you need to reach more protein, use ingredeints with high protein count. 
      
      Allergies or restrictions: ${allergies || "none"}.
      Preferred cuisine: ${cuisine || "no preference"}.
      Snacks included: ${snacks ? "yes" : "no"}.
      Meal variety: ${variety === 1 ? "no variations" : `${variety} variations`} per meal occasion.
      
      For each day, provide:
        - Breakfast
        - Lunch
        - Dinner
        ${snacks ? "- Snacks" : ""}
      
      Use simple ingredients and provide brief instructions. Include approximate calorie counts and protein counts for each meal.
      
      Structure the response as a JSON object where each day is a key, and each meal (breakfast, lunch, dinner, snacks) is a sub-key. For each meal, provide ${
        variety === 1 ? "the same meal for all days" : `${variety} variations`
      }. Example:
      
      {
        "Monday": {
          "Breakfast": {
            "description": "Oatmeal with fruits",
            "calories": 350,
            "protein": 10
          },
          "Lunch": {
            "description": "Grilled chicken salad",
            "calories": 500,
            "protein": 30
          },
          "Dinner": {
            "description": "Steamed vegetables with quinoa",
            "calories": 600,
            "protein": 20
          },
          "Snacks": {
            "description": "Greek yogurt",
            "calories": 150,
            "protein": 10
          }
        },
        "Tuesday": {
          "Breakfast": {
            "description": "Oatmeal with fruits",
            "calories": 350,
            "protein": 10
          },
          "Lunch": {
            "description": "Grilled chicken salad",
            "calories": 500,
            "protein": 30
          },
          "Dinner": {
            "description": "Steamed vegetables with quinoa",
            "calories": 600,
            "protein": 20
          },
          "Snacks": {
            "description": "Greek yogurt",
            "calories": 150,
            "protein": 10
          }
        }
        // ...and so on for each day
      }

      Return just the JSON with no extra commentaries and no backticks.
    `;

    // Send the prompt to the AI model
    const response = await openai.chat.completions.create({
      model: "meta-llama/llama-3.2-3b-instruct:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Extract the AI's response
    const aiContent = response.choices[0].message.content.trim();

    // Clean up the AI's response to ensure it's valid JSON
    let cleanedContent = aiContent;

    // Remove Markdown code block syntax (e.g., ```json```)
    if (cleanedContent.startsWith("```json") && cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.slice(7, -3).trim();
    } else if (cleanedContent.startsWith("```") && cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.slice(3, -3).trim();
    }

    // Attempt to parse the cleaned content as JSON
    let parsedMealPlan: { [day: string]: DailyMealPlan };
    console.log("Cleaned AI Response:", cleanedContent);
    try {
      parsedMealPlan = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Error parsing AI response as JSON:", parseError);
      // If parsing fails, return the raw text with an error message
      return NextResponse.json(
        { error: "Failed to parse meal plan. Please try again.", rawResponse: cleanedContent },
        { status: 500 }
      );
    }

    // Validate the structure of the parsedMealPlan
    if (typeof parsedMealPlan !== "object" || parsedMealPlan === null) {
      throw new Error("Invalid meal plan format received from AI.");
    }

    // Return the parsed meal plan
    return NextResponse.json({ mealPlan: parsedMealPlan });
  } catch (error) {
    console.error("Error generating meal plan:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan. Please try again later." },
      { status: 500 }
    );
  }
}

// Define the DailyMealPlan interface here or import it if defined elsewhere
interface DailyMealPlan {
  Breakfast?: Meal;
  Lunch?: Meal;
  Dinner?: Meal;
  Snacks?: Meal;
}

interface Meal {
  description: string;
  calories: number;
  protein: number;
}