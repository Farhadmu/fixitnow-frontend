"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, CalendarClock } from "lucide-react";
import { availabilitySchema, type AvailabilityInput } from "@/lib/validations";
import { useUpdateAvailability } from "@/hooks/useTechnicianActions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FieldError } from "@/components/ui/FieldError";
import { DAY_NAMES, cn } from "@/lib/utils";
import type { Availability } from "@/types";

export function AvailabilityScheduler({ slots }: { slots: Availability[] }) {
  const updateAvailability = useUpdateAvailability();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AvailabilityInput>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      slots:
        slots.length > 0
          ? slots.map((s) => ({
              dayOfWeek: s.dayOfWeek,
              startTime: s.startTime,
              endTime: s.endTime,
              isAvailable: s.isAvailable,
            }))
          : [{ dayOfWeek: 1, startTime: "09:00", endTime: "17:00", isAvailable: true }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "slots" });

  return (
    <form
      onSubmit={handleSubmit((v) => updateAvailability.mutate(v))}
      className="rounded-ticket border border-blueprint-800/10 bg-paper-50 p-5"
    >
      <div className="flex items-center gap-2 font-display text-lg font-semibold text-blueprint-900">
        <CalendarClock className="h-4 w-4" />
        Weekly availability
      </div>
      <p className="mt-1 text-xs text-blueprint-500">Click a day to block out working hours customers can book.</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {DAY_NAMES.map((day, dayIndex) => {
          const dayFieldIndexes = fields
            .map((f, i) => ({ f, i }))
            .filter(({ f }) => f.dayOfWeek === dayIndex);

          return (
            <div
              key={day}
              className={cn(
                "flex flex-col rounded-ticket border p-3",
                dayFieldIndexes.length > 0 ? "border-amber-500/40 bg-amber-500/5" : "border-dashed border-blueprint-800/15"
              )}
            >
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-blueprint-700">
                {day.slice(0, 3)}
              </span>

              <div className="mt-2 flex flex-1 flex-col gap-2">
                {dayFieldIndexes.length === 0 && (
                  <p className="text-[11px] text-blueprint-400">Unavailable</p>
                )}

                {dayFieldIndexes.map(({ i }) => (
                  <div key={fields[i].id} className="space-y-1 rounded-ticket bg-paper-100 p-2">
                    <input type="hidden" value={dayIndex} {...register(`slots.${i}.dayOfWeek` as const, { valueAsNumber: true })} />
                    <Input type="time" className="h-7 text-xs" {...register(`slots.${i}.startTime` as const)} />
                    <Input type="time" className="h-7 text-xs" {...register(`slots.${i}.endTime` as const)} />
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="flex w-full items-center justify-center gap-1 rounded-ticket py-1 text-[10px] text-rust-500 hover:bg-rust-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 h-7 w-full text-xs"
                onClick={() => append({ dayOfWeek: dayIndex, startTime: "09:00", endTime: "17:00", isAvailable: true })}
              >
                <Plus className="h-3 w-3" />
                Add block
              </Button>
            </div>
          );
        })}
      </div>
      <FieldError message={errors.slots?.message as string | undefined} />

      <div className="mt-5">
        <Button type="submit" isLoading={updateAvailability.isPending}>
          Save availability
        </Button>
      </div>
    </form>
  );
}