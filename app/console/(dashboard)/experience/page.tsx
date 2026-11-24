"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Briefcase, Trash2, X } from "lucide-react";

import {
  ErrorBanner,
  Field,
  SuccessBanner,
  SubmitButton,
  inputClass,
  textareaClass,
} from "@/components/console/fields";
import { useConsoleApi } from "@/components/console/use-console-api";
import { experienceDuration } from "@/lib/portfolio";

interface ExperienceItem {
  _id: string;
  role: string;
  company: string;
  period: string;
  startDate?: string;
  endDate?: string;
  points: string[];
  highlight?: string;
  imageFileId?: string;
  image?: string;
  order: number;
}

interface ExperienceForm {
  _id?: string;
  role: string;
  company: string;
  period: string;
  startDate: string;
  endDate: string;
  points: string;
  highlight: string;
  imageFileId: string;
  image: string;
  order: number;
}

const EMPTY: ExperienceForm = {
  role: "",
  company: "",
  period: "",
  startDate: "",
  endDate: "",
  points: "",
  highlight: "",
  imageFileId: "",
  image: "",
  order: 0,
};

function toItem(e: ExperienceItem): ExperienceForm {
  return {
    _id: e._id,
    role: e.role,
    company: e.company,
    period: e.period ?? "",
    startDate: e.startDate ?? "",
    endDate: e.endDate ?? "",
    points: (e.points ?? []).join("\n"),
    highlight: e.highlight ?? "",
    imageFileId: e.imageFileId ?? "",
    image: e.image ?? "",
    order: e.order,
  };
}

export default function ConsoleExperiencePage() {
  const api = useConsoleApi();
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [form, setForm] = useState<ExperienceForm>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    try {
      setItems(await api.get<ExperienceItem[]>("/api/admin/experiences"));
    } catch (e) {
      if (!(e instanceof Error && e.message === "Unauthorized")) {
        setError(e instanceof Error ? e.message : "Failed to load");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    Promise.resolve().then(load);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function edit(e: ExperienceItem) {
    setForm(toItem(e));
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setForm(EMPTY);
    setSuccess(null);
  }

  async function save(ev: React.FormEvent) {
    ev.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        role: form.role,
        company: form.company,
        period:
          form.period ||
          (form.startDate
            ? `${form.startDate} – ${form.endDate || "Present"}`
            : form.period),
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        points: form.points
          .split("\n")
          .map((p) => p.trim())
          .filter(Boolean),
        highlight: form.highlight || undefined,
        imageFileId: form.imageFileId ? form.imageFileId : null,
        order: form.order,
      };
      if (form._id) {
        await api.put(`/api/admin/experiences/${form._id}`, payload);
        setSuccess(`Saved “${form.role}”`);
      } else {
        await api.post("/api/admin/experiences", payload);
        setSuccess(`Created “${form.role}”`);
      }
      setForm(EMPTY);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(e: ExperienceItem) {
    if (!confirm(`Delete “${e.role}” at ${e.company}?`)) return;
    setError(null);
    try {
      await api.del(`/api/admin/experiences/${e._id}`);
      if (form._id === e._id) setForm(EMPTY);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function move(e: ExperienceItem, direction: -1 | 1) {
    const idx = items.findIndex((i) => i._id === e._id);
    const swap = items[idx + direction];
    if (!swap) return;
    try {
      await Promise.all([
        api.put(`/api/admin/experiences/${e._id}`, { ...e, order: swap.order }),
        api.put(`/api/admin/experiences/${swap._id}`, { ...swap, order: e.order }),
      ]);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reorder failed");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Job Experience</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length} experience{items.length === 1 ? "" : "s"} — shown in order
        on the Experience and About pages.
      </p>

      <form
        onSubmit={save}
        className="mt-6 rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">
            {form._id ? `Edit: ${form.role}` : "New experience"}
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
          <Field label="Role / title">
            <input
              required
              className={inputClass}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </Field>
          <Field label="Company">
            <input
              required
              className={inputClass}
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </Field>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Period" hint="e.g. 2025 – Present">
            <input
              className={inputClass}
              value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
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

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Start date" hint="month/year">
            <input
              type="month"
              className={inputClass}
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </Field>
          <Field label="End date" hint="leave empty for Present">
            <input
              type="month"
              className={inputClass}
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Responsibilities" hint="one per line">
            <textarea
              className={textareaClass}
              value={form.points}
              onChange={(e) => setForm({ ...form, points: e.target.value })}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Highlight" hint="optional award / note">
            <input
              className={inputClass}
              value={form.highlight}
              onChange={(e) => setForm({ ...form, highlight: e.target.value })}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Workplace photo" hint="optional image from when you worked there">
            {form.image && (
              <div className="mb-2 overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt="Workplace" className="h-40 w-full object-cover" />
              </div>
            )}
            <div className="flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadingImage(true);
                    setError(null);
                    try {
                      const fd = new FormData();
                      fd.append("file", file);
                      const res = await fetch("/api/admin/media", {
                        method: "POST",
                        body: fd,
                      });
                      if (!res.ok) {
                        const data = await res.json().catch(() => ({}));
                        throw new Error(data.error ?? `Upload failed (${res.status})`);
                      }
                      const data = (await res.json()) as { id: string; url: string };
                      setForm((f) => ({ ...f, imageFileId: data.id, image: data.url }));
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Upload failed");
                    } finally {
                      setUploadingImage(false);
                      e.target.value = "";
                    }
                  }}
                />
                {uploadingImage ? "Uploading…" : "Choose photo"}
              </label>
              {form.imageFileId && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, imageFileId: "", image: "" }))}
                  className="text-sm text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              )}
            </div>
          </Field>
        </div>

        <div className="mt-6">
          <SubmitButton loading={saving}>
            {form._id ? "Save changes" : "Create experience"}
          </SubmitButton>
        </div>
      </form>

      <div className="mt-4">
        <ErrorBanner error={error} />
        <SuccessBanner message={success} />
      </div>

      <h2 className="mt-10 font-display text-base font-semibold">
        All experience
      </h2>
      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No experience entries yet — create one above. (Static defaults from
          your CV show on the site until the first entry exists.)
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((e, i) => (
            <li
              key={e._id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <span className="w-6 shrink-0 text-center font-mono text-xs text-muted-foreground">
                {i + 1}
              </span>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-brand/25 bg-brand/10 text-brand">
                <Briefcase className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{e.role}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {e.company}
                  {e.period ? ` · ${e.period}` : ""}
                  {experienceDuration(e) ? ` · ${experienceDuration(e)}` : ""}
                  {e.points?.length ? ` · ${e.points.length} points` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(e, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="rounded-md p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowUp className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(e, 1)}
                  disabled={i === items.length - 1}
                  aria-label="Move down"
                  className="rounded-md p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  <ArrowDown className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => edit(e)}
                  className="rounded-md px-2.5 py-1.5 text-sm text-brand hover:bg-brand/10"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => remove(e)}
                  aria-label={`Delete ${e.role}`}
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
