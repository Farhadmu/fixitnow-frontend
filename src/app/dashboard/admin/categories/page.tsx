"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layers, Plus, Pencil, Trash2, X } from "lucide-react";
import { RequireRole } from "@/components/RequireRole";
import { useCategories } from "@/hooks/usePublicData";
import { useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/hooks/useAdmin";
import { categorySchema, type CategoryInput } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { FieldError } from "@/components/ui/FieldError";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Category } from "@/types";

function CategoryForm({ initial, onDone }: { initial?: Category; onDone: () => void }) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: initial ? { name: initial.name, description: initial.description || "" } : undefined,
  });

  const onSubmit = async (values: CategoryInput) => {
    if (initial) {
      await updateCategory.mutateAsync({ id: initial.id, payload: values });
    } else {
      await createCategory.mutateAsync(values);
    }
    onDone();
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-3 rounded-ticket border border-blueprint-800/10 bg-paper-50 p-5 sm:grid-cols-[1fr_1fr_auto]"
    >
      <div>
        <Label htmlFor="name">Category name</Label>
        <Input id="name" placeholder="e.g. Gardening" error={errors.name?.message} {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>
      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Input id="description" placeholder="Short description" {...register("description")} />
      </div>
      <div className="flex items-end gap-2">
        <Button type="submit" className="w-full sm:w-auto" isLoading={isPending}>
          {initial ? (
            "Save"
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add
            </>
          )}
        </Button>
        {initial && (
          <Button type="button" variant="ghost" onClick={onDone} aria-label="Cancel edit">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}

function AdminCategoriesContent() {
  const { data, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  const [editingId, setEditingId] = useState<string | null>(null);
  const categories = data?.data || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-blueprint-900">Service categories</h1>
        <p className="mt-1 text-sm text-blueprint-500">
          Create, edit, and remove the categories technicians list services under.
        </p>
      </div>

      <CategoryForm onDone={() => {}} />

      <div>
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-blueprint-900">
          <Layers className="h-4 w-4" />
          All categories
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          {!isLoading && categories.length === 0 && (
            <div className="sm:col-span-2 lg:col-span-3">
              <EmptyState icon={Layers} title="No categories yet" description="Add your first category above." />
            </div>
          )}
          {!isLoading &&
            categories.map((c) =>
              editingId === c.id ? (
                <div key={c.id} className="sm:col-span-2 lg:col-span-3">
                  <CategoryForm initial={c} onDone={() => setEditingId(null)} />
                </div>
              ) : (
                <div
                  key={c.id}
                  className="flex items-start justify-between rounded-ticket border border-blueprint-800/10 bg-paper-50 p-4"
                >
                  <div>
                    <p className="font-medium text-blueprint-900">{c.name}</p>
                    {c.description && <p className="mt-1 text-xs text-blueprint-500">{c.description}</p>}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(c.id)} aria-label="Edit category">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteCategory.mutate(c.id)}
                      isLoading={deleteCategory.isPending && deleteCategory.variables === c.id}
                      aria-label="Delete category"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rust-500" />
                    </Button>
                  </div>
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <RequireRole role="ADMIN">
      <AdminCategoriesContent />
    </RequireRole>
  );
}
