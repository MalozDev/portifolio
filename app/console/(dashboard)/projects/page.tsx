"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ImageIcon, Star, Trash2, X } from "lucide-react";

import {
  ErrorBanner,
  Field,
  SuccessBanner,
  SubmitButton,
  inputClass,
  textareaClass,
} from "@/components/console/fields";
import { useConsoleApi } from "@/components/console/use-console-api";

interface ProjectItem {
  _id: string;
  title: string;
  description: string;
  href?: string;
  tech: string[];
  featured: boolean;
  accent: [string, string];
  pattern: "dots" | "grid" | "waves" | "circles";
  image?: string;
  imageFileId?: string;
  order: number;
}

interface ProjectForm {
  _id?: string;
  title: string;
  description: string;
  href: string;
  tech: string;
  featured: boolean;
  accent1: string;
  accent2: string;
  pattern: string;
  imageFileId?: string;
  image?: string;
  order: number;
}

const EMPTY: ProjectForm = {
  title: "",
  description: "",
  href: "",
  tech: "",
  featured: false,
  accent1: "#45fe84",
  accent2: "#22d3ee",
  pattern: "grid",
  order: 0,
};

function toItem(p: ProjectItem): ProjectForm {
  return {
    _id: p._id,
    title: p.title,
    description: p.description,
    href: p.href ?? "",
    tech: (p.tech ?? []).join(", "),
    featured: p.featured,
    accent1: p.accent?.[0] ?? "#45fe84",
    accent2: p.accent?.[1] ?? "#22d3ee",
    pattern: p.pattern ?? "grid",
    imageFileId: p.imageFileId,
    image: p.image,
    order: p.order,
  };
}

export default function ConsoleProjectsPage() {
  const api = useConsoleApi();
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [form, setForm] = useState<ProjectForm>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    try {
      setItems(await api.get<ProjectItem[]>("/api/admin/projects"));
    } catch (e) {
      if (!(e instanceof Error && e.message === "Unauthorized")) {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Kick off in a microtask so no setState runs synchronously in the effect.
    Promise.resolve().then(load);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function edit(p: ProjectItem) {
    setForm(toItem(p));
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setForm(EMPTY);
    setSuccess(null);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Upload failed");
      }
      const data = (await res.json()) as { id: string; url: string };
      setForm((f) => ({ ...f, imageFileId: data.id, image: data.url }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        href: form.href,
        tech: form.tech.split(",").map((t) => t.trim()).filter(Boolean),
        featured: form.featured,
        accent: [form.accent1, form.accent2],
        pattern: form.pattern,
        imageFileId: form.imageFileId ?? null,
        order: form.order,
      };
      if (form._id) {
        await api.put(`/api/admin/projects/${form._id}`, payload);
        setSuccess(`Saved “${form.title}”`);
      } else {
        await api.post("/api/admin/projects", payload);
        setSuccess(`Created “${form.title}”`);
      }
      setForm(EMPTY);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(p: ProjectItem) {
    if (!confirm(`Delete “${p.title}”? This cannot be undone.`)) return;
    setError(null);
    try {
      await api.del(`/api/admin/projects/${p._id}`);
      if (form._id === p._id) setForm(EMPTY);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function move(p: ProjectItem, direction: -1 | 1) {
    const idx = items.findIndex((i) => i._id === p._id);
    const swap = items[idx + direction];
    if (!swap) return;
    try {
      await Promise.all([
        api.put(`/api/admin/projects/${p._id}`, { ...p, order: swap.order }),
        api.put(`/api/admin/projects/${swap._id}`, { ...swap, order: p.order }),
      ]);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reorder failed");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Projects</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length} project{items.length === 1 ? "" : "s"} — shown in order on
        the Projects page.
      </p>

      {/* Editor */}
      <form
        onSubmit={save}
        className="mt-6 rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">
            {form._id ? `Edit: ${form.title}` : "New project"}
          </h2>
          {form._id && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
              Cancel edit
            </button>
          )}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Title">
            <input
              required
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Live URL" hint="optional">
            <input
              type="url"
              className={inputClass}
              value={form.href}
              placeholder="https://…"
              onChange={(e) => setForm({ ...form, href: e.target.value })}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Description">
            <textarea
              className={textareaClass}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </Field>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Tech stack" hint="comma separated">
            <input
              className={inputClass}
              value={form.tech}
              placeholder="React, Node.js, PostgreSQL"
              onChange={(e) => setForm({ ...form, tech: e.target.value })}
            />
          </Field>
          <Field label="Pattern" hint="cover artwork">
            <select
              className={inputClass}
              value={form.pattern}
              onChange={(e) =>
                setForm({ ...form, pattern: e.target.value as ProjectForm["pattern"] })
              }
            >
              <option value="grid">grid</option>
              <option value="waves">waves</option>
              <option value="dots">dots</option>
              <option value="circles">circles</option>
            </select>
          </Field>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Field label="Accent 1">
            <input
              type="color"
              className="h-10 w-full cursor-pointer rounded-lg border border-input bg-background p-1"
              value={form.accent1}
              onChange={(e) => setForm({ ...form, accent1: e.target.value })}
            />
          </Field>
          <Field label="Accent 2">
            <input
              type="color"
              className="h-10 w-full cursor-pointer rounded-lg border border-input bg-background p-1"
              value={form.accent2}
              onChange={(e) => setForm({ ...form, accent2: e.target.value })}
            />
          </Field>
          <Field label="Order">
            <input
              type="number"
              className={inputClass}
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: Number(e.target.value) || 0 })
              }
            />
          </Field>
        </div>

        {/* Image upload */}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:border-brand/40 hover:text-brand">
            <ImageIcon className="size-4" />
            {uploading ? "Uploading…" : form.image ? "Replace image" : "Upload image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file);
              }}
            />
          </label>
          {form.image && (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.image}
                alt=""
                className="h-14 w-24 rounded-lg border border-border object-cover"
              />
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, image: undefined, imageFileId: undefined })
                }
                className="text-sm text-muted-foreground hover:text-destructive"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            className="size-4 accent-[var(--color-brand)]"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          Featured (shown on the home page)
        </label>

        <div className="mt-6">
          <SubmitButton loading={saving}>
            {form._id ? "Save changes" : "Create project"}
          </SubmitButton>
        </div>
      </form>

      <div className="mt-4">
        <ErrorBanner error={error} />
        <SuccessBanner message={success} />
      </div>

      {/* List */}
      <h2 className="mt-10 font-display text-base font-semibold">All projects</h2>
      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No projects yet — create one above. (Static defaults show on the site
          until the first project exists.)
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((p, i) => (
            <li
              key={p._id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <span className="w-6 shrink-0 text-center font-mono text-xs text-muted-foreground">
                {i + 1}
              </span>
              {p.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={p.image}
                  alt=""
                  className="h-10 w-16 shrink-0 rounded-md border border-border object-cover"
                />
              ) : (
                <span
                  className="h-10 w-16 shrink-0 rounded-md border border-border"
                  style={{
                    background: `linear-gradient(135deg, ${p.accent?.[0] ?? "#45fe84"}33, ${p.accent?.[1] ?? "#22d3ee"}22)`,
                  }}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {p.title}
                  {p.featured && (
                    <Star
                      className="ml-1.5 inline size-3.5 fill-brand text-brand"
                      aria-label="Featured"
                    />
                  )}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {(p.tech ?? []).join(" · ") || "no tech listed"}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(p, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="rounded-md p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowUp className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(p, 1)}
                  disabled={i === items.length - 1}
                  aria-label="Move down"
                  className="rounded-md p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowDown className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => edit(p)}
                  className="rounded-md px-2.5 py-1.5 text-sm text-brand hover:bg-brand/10"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(p)}
                  aria-label={`Delete ${p.title}`}
                  className="rounded-md p-1.5 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
