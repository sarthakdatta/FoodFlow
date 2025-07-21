"use client";

import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@/components/spinner";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SendHorizonal, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  dietType: string[];
  calories: number;
  proteinGoal: number;
  allergies: string[];
  cuisine: string[];
  snacks: boolean;
  variety: number;
  days?: number;
}

export default function MealPlanDashboard() {
  const [dietType, setDietType] = useState<string[]>([]);
  const [calories, setCalories] = useState<number>(2000);
  const [proteinGoal, setProteinGoal] = useState<number>(100);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState<string[]>([]);
  const [snacks, setSnacks] = useState(false);
  const [variety, setVariety] = useState<number>(1);
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

    // Validate calories
    if (calories < 1000 || calories > 5000) {
      setCaloriesError("Calories must be between 1000 and 5000.");
      return;
    } else {
      setCaloriesError(null);
    }

    // Validate protein
    if (proteinGoal < 40 || proteinGoal > 400) {
      setProteinError("Protein must be between 40 and 400 grams.");
      return;
    } else {
      setProteinError(null);
    }

    const payload: MealPlanInput = {
      dietType,
      calories,
      proteinGoal,
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

  // Function to handle multi-select changes
  const handleMultiSelectChange = (value: string, currentState: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (currentState.includes(value)) {
      setState(currentState.filter(item => item !== value));
    } else {
      setState([...currentState, value]);
    }
  };

  // Function to clear all selected options
  const clearAllOptions = (setState: React.Dispatch<React.SetStateAction<string[]>>) => {
    setState([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-8 text-primary">
        AI Meal Generator
      </h1>

      {/* Inputs Section */}
      <Card className="w-full max-w-4xl mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Meal Plan Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Dropdowns */}
              <div className="space-y-6">
                {/* Diet Type */}
                <div className="space-y-2">
                  <Label htmlFor="dietType">Diet Type</Label>
                  <Select onValueChange={(value) => handleMultiSelectChange(value, dietType, setDietType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet types" />
                    </SelectTrigger>
                    <SelectContent>
                      {dietTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2">
                    {dietType.map((type) => (
                      <Badge key={type} className="flex items-center gap-2">
                        {type}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleMultiSelectChange(type, dietType, setDietType)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => clearAllOptions(setDietType)}>
                    Clear All
                  </Button>
                </div>

                {/* Allergies */}
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies or Restrictions</Label>
                  <Select onValueChange={(value) => handleMultiSelectChange(value, allergies, setAllergies)}>
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
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy) => (
                      <Badge key={allergy} className="flex items-center gap-2">
                        {allergy}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleMultiSelectChange(allergy, allergies, setAllergies)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => clearAllOptions(setAllergies)}>
                    Clear All
                  </Button>
                </div>

                {/* Preferred Cuisine */}
                <div className="space-y-2">
                  <Label htmlFor="cuisine">Preferred Cuisine</Label>
                  <Select onValueChange={(value) => handleMultiSelectChange(value, cuisine, setCuisine)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisines" />
                    </SelectTrigger>
                    <SelectContent>
                      {cuisines.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2">
                    {cuisine.map((selectedCuisine) => (
                      <Badge key={selectedCuisine} className="flex items-center gap-2">
                        {selectedCuisine}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleMultiSelectChange(selectedCuisine, cuisine, setCuisine)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => clearAllOptions(setCuisine)}>
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Right Column: Sliders */}
              <div className="space-y-6">
                {/* Calories Slider */}
                <div className="space-y-2">
                  <Label htmlFor="calories">Daily Calorie Goal</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="calories"
                      value={[calories]}
                      onValueChange={([value]) => setCalories(value)}
                      min={1000}
                      max={5000}
                      step={100}
                    />
                    <span className="text-lg font-medium">{calories} kcal</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Adjust your daily calorie intake goal.
                  </p>
                </div>

                {/* Protein Goal Slider */}
                <div className="space-y-2">
                  <Label htmlFor="proteinGoal">Daily Protein Goal (grams)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="proteinGoal"
                      value={[proteinGoal]}
                      onValueChange={([value]) => setProteinGoal(value)}
                      min={40}
                      max={400}
                      step={10}
                    />
                    <span className="text-lg font-medium">{proteinGoal} g</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Adjust your daily protein intake goal.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section: Snacks and Variety */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <Button type="submit" disabled={mutation.isPending} className="w-full mt-6">
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
      <Card className="w-full max-w-4xl shadow-lg">
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