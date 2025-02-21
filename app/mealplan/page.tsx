"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@/components/spinner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SendHorizonal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Meal {
  description: string;
  calories: number;
  protein: number;
}

interface DailyMealPlan {
  Breakfast?: Meal;
  Lunch?: Meal;
  Dinner?: Meal;
  Snacks?: Meal;
}

interface WeeklyMealPlan {
  [day: string]: DailyMealPlan;
}

interface MealPlanResponse {
  mealPlan?: WeeklyMealPlan;
  error?: string;
}

interface MealPlanInput {
  dietType: string;
  calories: number;
  proteinGoal: number;
  allergies: string;
  cuisine: string;
  snacks: boolean;
  variety: number;
  days?: number;
}

export default function MealPlanDashboard() {
  const [dietType, setDietType] = useState("");
  const [calories, setCalories] = useState<string>("2000"); // Initialize as string
  const [proteinGoal, setProteinGoal] = useState<string>("100"); // Initialize as string
  const [allergies, setAllergies] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [snacks, setSnacks] = useState(false);
  const [variety, setVariety] = useState<number>(1); // Default to 1 (no variations)
  const [caloriesError, setCaloriesError] = useState<string | null>(null);
  const [proteinError, setProteinError] = useState<string | null>(null);

  // Diet types, cuisines, and allergies options
  const dietTypes = ["None", "Vegetarian", "Vegan", "Keto", "Mediterranean", "Paleo", "Low-Carb", "No Beef", "No Pork"];
  const cuisines = ["None", "Italian", "Chinese", "Indian", "Mexican", "Japanese", "Mediterranean"];
  const allergiesList = ["None", "Nuts", "Dairy", "Gluten", "Shellfish", "Eggs", "Soy"];

  // Initialize the mutation using React Query
  const mutation = useMutation<MealPlanResponse, Error, MealPlanInput>({
    mutationFn: async (payload: MealPlanInput) => {
      const response = await fetch("/api/generate-mealplan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData: MealPlanResponse = await response.json();
        throw new Error(errorData.error || "Failed to generate meal plan.");
      }

      return response.json();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert calories and proteinGoal to numbers
    const caloriesNum = Number(calories);
    const proteinGoalNum = Number(proteinGoal);

    // Validate calories
    if (caloriesNum < 1000 || caloriesNum > 5000) {
      setCaloriesError("Calories must be between 1000 and 5000.");
      return;
    } else {
      setCaloriesError(null);
    }

    // Validate protein
    if (proteinGoalNum < 40 || proteinGoalNum > 400) {
      setProteinError("Protein must be between 40 and 400 grams.");
      return;
    } else {
      setProteinError(null);
    }

    const payload: MealPlanInput = {
      dietType,
      calories: caloriesNum,
      proteinGoal: proteinGoalNum,
      allergies,
      cuisine,
      snacks,
      variety,
      days: 7, // Ensure a weekly plan is generated
    };

    mutation.mutate(payload);
  };

  // Define the days of the week in order
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Function to retrieve the meal plan for a specific day
  const getMealPlanForDay = (day: string): DailyMealPlan | undefined => {
    if (!mutation.data?.mealPlan) return undefined;

    return mutation.data.mealPlan[day];
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 ">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 text-primary">
        AI Meal Generator
      </h1>

      {/* Inputs Section */}
      <Card className="w-full max-w-4xl mb-8">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Meal Plan Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Dropdowns */}
              <div className="space-y-4">
                {/* Diet Type */}
                <div className="space-y-2">
                  <Label htmlFor="dietType">Diet Type</Label>
                  <Select value={dietType} onValueChange={setDietType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dietTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Allergies */}
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies or Restrictions</Label>
                  <Select value={allergies} onValueChange={setAllergies}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select allergies or restrictions" />
                    </SelectTrigger>
                    <SelectContent>
                      {allergiesList.map((allergy) => (
                        <SelectItem key={allergy} value={allergy}>
                          {allergy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preferred Cuisine */}
                <div className="space-y-2">
                  <Label htmlFor="cuisine">Preferred Cuisine</Label>
                  <Select value={cuisine} onValueChange={setCuisine}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisines.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right Column: Number Inputs */}
              <div className="space-y-4">
                {/* Calories */}
                <div className="space-y-2">
                  <Label htmlFor="calories">Daily Calorie Goal</Label>
                  <Input
                    type="number"
                    id="calories"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="e.g., 2000"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                  {caloriesError && (
                    <p className="text-sm text-red-600">{caloriesError}</p>
                  )}
                </div>

                {/* Protein Goal */}
                <div className="space-y-2">
                  <Label htmlFor="proteinGoal">Daily Protein Goal (grams)</Label>
                  <Input
                    type="number"
                    id="proteinGoal"
                    value={proteinGoal}
                    onChange={(e) => setProteinGoal(e.target.value)}
                    placeholder="e.g., 100"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                  {proteinError && (
                    <p className="text-sm text-red-600">{proteinError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section: Snacks and Variety */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Snacks */}
              <div className="flex items-center space-x-2 p-4 border rounded-lg bg-muted">
                <Checkbox
                  id="snacks"
                  checked={snacks}
                  onCheckedChange={(checked) => setSnacks(!!checked)}
                />
                <Label htmlFor="snacks" className="text-lg font-medium">
                  Include Snacks
                </Label>
              </div>

              {/* Variety Slider */}
              <div className="space-y-2 p-4 border rounded-lg bg-muted">
                <Label htmlFor="variety" className="text-lg font-medium">
                  Meal Variety (1-3 variations)
                </Label>
                <Slider
                  id="variety"
                  value={[variety]}
                  onValueChange={([value]) => setVariety(value)}
                  min={1}
                  max={3}
                  step={1}
                  className="mt-4"
                />
                <span className="text-sm text-muted-foreground">
                  {variety} variation(s)
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={mutation.isPending} className="w-full mt-4">
              {mutation.isPending ? "Generating..." : "Generate Meal Plan"}
              <SendHorizonal className="ml-2" />
            </Button>
          </form>
        </CardContent>

        {/* Error Message */}
        {mutation.isError && (
          <CardFooter className="text-red-600">
            {mutation.error?.message || "An unexpected error occurred."}
          </CardFooter>
        )}
      </Card>

      {/* Meal Plan Section */}
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Weekly Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {mutation.isSuccess && mutation.data.mealPlan ? (
            <div className="h-[600px] overflow-y-auto">
              <div className="space-y-6">
                {daysOfWeek.map((day) => {
                  const mealPlan = getMealPlanForDay(day);
                  return (
                    <Card key={day}>
                      <CardHeader>
                        <CardTitle className="text-lg">{day}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {mealPlan ? (
                          <div className="space-y-2">
                            {/* Breakfast */}
                            {mealPlan.Breakfast && (
                              <div>
                                <strong>Breakfast:</strong>{" "}
                                {mealPlan.Breakfast.description} (
                                {mealPlan.Breakfast.calories} calories,{" "}
                                {mealPlan.Breakfast.protein}g protein)
                              </div>
                            )}

                            {/* Lunch */}
                            {mealPlan.Lunch && (
                              <div>
                                <strong>Lunch:</strong> {mealPlan.Lunch.description}{" "}
                                ({mealPlan.Lunch.calories} calories,{" "}
                                {mealPlan.Lunch.protein}g protein)
                              </div>
                            )}

                            {/* Dinner */}
                            {mealPlan.Dinner && (
                              <div>
                                <strong>Dinner:</strong>{" "}
                                {mealPlan.Dinner.description} (
                                {mealPlan.Dinner.calories} calories,{" "}
                                {mealPlan.Dinner.protein}g protein)
                              </div>
                            )}

                            {/* Snacks */}
                            {mealPlan.Snacks && (
                              <div>
                                <strong>Snacks:</strong>{" "}
                                {mealPlan.Snacks.description} (
                                {mealPlan.Snacks.calories} calories,{" "}
                                {mealPlan.Snacks.protein}g protein)
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500">No meal plan available.</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : mutation.isPending ? (
            <div className="flex justify-center items-center h-full">
              <Spinner />
            </div>
          ) : (
            <p className="text-gray-600">
              Please generate a meal plan to see it here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}