"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { reviewSchema, type ReviewInput } from "@/lib/validations";
import { useCreateReview } from "@/hooks/useTechnicianActions";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/utils";

export function ReviewForm({ bookingId, onDone }: { bookingId: string; onDone?: () => void }) {
  const [hoverRating, setHoverRating] = useState(0);
  const createReview = useCreateReview();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewInput>({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 0 } });

  const rating = watch("rating");

  const onSubmit = async (values: ReviewInput) => {
    await createReview.mutateAsync({ ...values, bookingId });
    onDone?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-ticket border border-blueprint-800/10 bg-paper-50 p-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setValue("rating", star, { shouldValidate: true })}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              className={cn(
                "h-6 w-6",
                (hoverRating || rating) >= star ? "fill-amber-500 text-amber-500" : "text-blueprint-300"
              )}
            />
          </button>
        ))}
      </div>
      <FieldError message={errors.rating?.message} />

      <Textarea placeholder="How did the job go? (optional)" rows={3} {...register("comment")} />
      <FieldError message={errors.comment?.message} />

      <Button type="submit" size="sm" isLoading={createReview.isPending}>
        Submit review
      </Button>
    </form>
  );
}
