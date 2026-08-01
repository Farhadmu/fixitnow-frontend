"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Wrench, X } from "lucide-react";
import { serviceSchema, type ServiceInput } from "@/lib/validations";
import { useCreateService, useUpdateService, useDeleteService } from "@/hooks/useTechnicianActions";
import { useCategories } from "@/hooks/usePublicData";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, cn } from "@/lib/utils";
import type { Service } from "@/types";

function ServiceForm({ initial, onDone }: { initial?: Service; onDone: () => void }) {
  const { data: categoriesRes } = useCategories();
  const categories = categoriesRes?.data || [];
  const createService = useCreateService();
  const updateService = useUpdateService();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description || "",
          price: initial.price,
          categoryId: initial.categoryId,
          location: initial.location || "",
        }
      : undefined,
  });

  const onSubmit = async (values: ServiceInput) => {
    if (initial) {
      await updateService.mutateAsync({ id: initial.id, payload: values });
    } else {
      await createService.mutateAsync(values);
    }
    onDone();
  };

  const isPending = createService.isPending || updateService.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-ticket border border-dashed border-blueprint-800/20 bg-blueprint-800/5 p-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="e.g. Pipe Leak Repair" error={errors.title?.message} {...register("title")} />
        <FieldError message={errors.title?.message} />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={2} {...register("description")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="price">Price (USD)</Label>
          <Input id="price" type="number" step="0.01" error={errors.price?.message} {...register("price")} />
          <FieldError message={errors.price?.message} />
        </div>
        <div>
          <Label htmlFor="categoryId">Category</Label>
          <Select id="categoryId" error={errors.categoryId?.message} {...register("categoryId")}>
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <FieldError message={errors.categoryId?.message} />
        </div>
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" placeholder="e.g. Dhaka" {...register("location")} />
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="sm" isLoading={isPending}>
          {initial ? "Save changes" : "Create service"}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function ServiceManager({ services }: { services: Service[] }) {
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const deleteService = useDeleteService();

  return (
    <div className="rounded-ticket border border-blueprint-800/10 bg-paper-50 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-blueprint-900">My services</h2>
        {!creating && (
          <Button size="sm" variant="secondary" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4" />
            Add service
          </Button>
        )}
      </div>

      {creating && (
        <div className="mt-4">
          <ServiceForm onDone={() => setCreating(false)} />
        </div>
      )}

      <div className="mt-4 space-y-3">
        {services.length === 0 && !creating && (
          <EmptyState icon={Wrench} title="No services yet" description="Add your first service so customers can book you." />
        )}

        {services.map((s) =>
          editingId === s.id ? (
            <ServiceForm key={s.id} initial={s} onDone={() => setEditingId(null)} />
          ) : (
            <div key={s.id} className="flex items-center justify-between rounded-ticket border border-blueprint-800/10 p-3">
              <div>
                <p className={cn("font-medium text-blueprint-900", !s.isActive && "text-blueprint-400 line-through")}>
                  {s.title}
                </p>
                <p className="text-xs text-blueprint-500">{formatCurrency(s.price)} · {s.category?.name}</p>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditingId(s.id)} aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteService.mutate(s.id)}
                  aria-label="Delete"
                  isLoading={deleteService.isPending && deleteService.variables === s.id}
                >
                  <Trash2 className="h-4 w-4 text-rust-500" />
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
