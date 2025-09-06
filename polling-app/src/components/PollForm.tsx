"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

/**
 * Zod schema for poll form validation.
 * 
 * Defines client-side validation rules that mirror the server-side validation
 * to provide immediate feedback to users and reduce unnecessary API calls.
 */
const pollSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least 2 options are required").max(10, "Maximum 10 options allowed"),
});

type PollFormData = z.infer<typeof pollSchema>;

interface PollFormProps {
  /** Callback function called when form is submitted with valid data */
  onSubmit: (data: PollFormData) => Promise<void>;
  /** Whether the form is currently submitting (disables submit button) */
  isLoading?: boolean;
}

/**
 * PollForm Component
 * 
 * A dynamic form component for creating new polls with the following features:
 * - Real-time validation using React Hook Form + Zod
 * - Dynamic option management (add/remove 2-10 options)
 * - Optimized state management with consolidated updates
 * - Accessible form controls with proper labels and ARIA attributes
 * - Responsive design with shadcn/ui components
 * 
 * The component maintains two sources of truth for options:
 * 1. Local state for immediate UI updates
 * 2. React Hook Form state for validation and submission
 * 
 * @param {PollFormProps} props - Component props
 * @returns {JSX.Element} The rendered poll creation form
 */
export function PollForm({ onSubmit, isLoading = false }: PollFormProps) {
  const [options, setOptions] = useState<string[]>(["", ""]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      title: "",
      description: "",
      options: ["", ""],
    },
  });

  /**
   * Centralized function to update both local state and form state.
   * 
   * This prevents code duplication and ensures both state sources
   * stay synchronized when options are modified.
   * 
   * @param {string[]} newOptions - The updated options array
   */
  const updateOptionsAndForm = (newOptions: string[]) => {
    setOptions(newOptions);
    setValue("options", newOptions);
  };

  /**
   * Adds a new empty option to the poll.
   * 
   * Enforces the maximum limit of 10 options to prevent UI clutter
   * and maintain reasonable poll complexity.
   */
  const addOption = () => {
    if (options.length < 10) {
      updateOptionsAndForm([...options, ""]);
    }
  };

  /**
   * Removes an option at the specified index.
   * 
   * Enforces the minimum limit of 2 options to ensure polls remain
   * meaningful and functional.
   * 
   * @param {number} index - The index of the option to remove
   */
  const removeOption = (index: number) => {
    if (options.length > 2) {
      updateOptionsAndForm(options.filter((_, i) => i !== index));
    }
  };

  /**
   * Updates the text content of a specific option.
   * 
   * Uses immutable update pattern with map() to ensure React
   * properly detects state changes and triggers re-renders.
   * 
   * @param {number} index - The index of the option to update
   * @param {string} value - The new text content
   */
  const updateOption = (index: number, value: string) => {
    updateOptionsAndForm(options.map((option, i) => i === index ? value : option));
  };

  const handleFormSubmit = async (data: PollFormData) => {
    // Filter out empty options
    const filteredOptions = data.options.filter(option => option.trim() !== "");
    const formData = { ...data, options: filteredOptions };
    await onSubmit(formData);
  };



  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
        <CardDescription>
          Create a new poll with a title, description, and multiple options for voting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title *</Label>
            <Input
              id="title"
              placeholder="Enter poll title..."
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter poll description..."
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Poll Options *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={options.length >= 10}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </Button>
            </div>

            <div className="space-y-3">
              {options.map((option, index) => {
                const fieldId = `option-${index}`;
                const fieldName = `options[${index}]` as const;
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Label htmlFor={fieldId} className="sr-only">{`Option ${index + 1}`}</Label>
                    <Input
                      id={fieldId}
                      name={fieldName}
                      placeholder={`Option ${index + 1}...`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className={errors.options?.[index] ? "border-red-500" : ""}
                      aria-invalid={!!errors.options?.[index]}
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="flex-shrink-0"
                        aria-label={`Remove option ${index + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {errors.options && (
              <p className="text-sm text-red-500">{errors.options.message}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Creating Poll..." : "Create Poll"}
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
