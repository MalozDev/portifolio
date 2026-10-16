"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Trash2, Upload } from "lucide-react";

import {
  ErrorBanner,
  Field,
  SuccessBanner,
  inputClass,
} from "@/components/console/fields";
import { useConsoleApi } from "@/components/console/use-console-api";

interface PhotoItem {
  _id: string;
  fileId: string;
  url: string;
  alt: string;
  caption?: string;
  order: number;
}

export default function ConsolePhotosPage() {
  const api = useConsoleApi();
  const [items, setItems] = useState<PhotoItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pendingAlt, setPendingAlt] = useState<Record<string, string>>({});

  async function load() {
    try {
      const photos = await api.get<PhotoItem[]>("/api/admin/photos");
      setItems(photos);
      setPendingAlt(Object.fromEntries(photos.map((p) => [p._id, p.alt])));
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

  async function uploadPhotos(files: FileList) {
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/media", { method: "POST", body: fd });
        if (res.status === 401) throw new Error("Unauthorized");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Upload failed for ${file.name}`);
        }
        const { id } = (await res.json()) as { id: string };
        await api.post("/api/admin/photos", {
          fileId: id,
          alt: file.name.replace(/\.[^.]+$/, ""),
        });
      }
      setSuccess("Photos uploaded — they appear on the About page slider.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function saveAlt(p: PhotoItem) {
    const alt = pendingAlt[p._id] ?? p.alt;
    if (alt === p.alt) return;
    try {
      const updated = await api.put<PhotoItem>(`/api/admin/photos/${p._id}`, {
        alt,
      });
      setItems((prev) => prev.map((i) => (i._id === p._id ? updated : i)));
      setSuccess("Photo updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function remove(p: PhotoItem) {
    if (!confirm("Remove this photo from the slider?")) return;
    setError(null);
    try {
      await api.del(`/api/admin/photos?id=${p._id}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  async function move(p: PhotoItem, direction: -1 | 1) {
    const idx = items.findIndex((i) => i._id === p._id);
    const swap = items[idx + direction];
    if (!swap) return;
    try {
      await Promise.all([
        api.put(`/api/admin/photos/${p._id}`, { order: swap.order }),
        api.put(`/api/admin/photos/${swap._id}`, { order: p.order }),
      ]);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reorder failed");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Photos</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        The slider on your About page. First photo shows first.
      </p>

      {/* Upload */}
      <label className="mt-6 inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-brand-dim disabled:pointer-events-none disabled:opacity-60">
        <Upload className="size-4" />
        {uploading ? "Uploading…" : "Upload photos"}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files?.length) uploadPhotos(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      <div className="mt-4">
        <ErrorBanner error={error} />
        <SuccessBanner message={success} />
      </div>

      {/* Gallery */}
      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          No photos uploaded — the About slider falls back to your default
          welcome images until you upload some.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((p, i) => (
            <li
              key={p._id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={p.alt}
                className="aspect-4/5 w-full object-cover"
              />
              <div className="p-4">
                <Field label="Alt text">
                  <input
                    className={inputClass}
                    value={pendingAlt[p._id] ?? p.alt}
                    onChange={(e) =>
                      setPendingAlt({ ...pendingAlt, [p._id]: e.target.value })
                    }
                    onBlur={() => saveAlt(p)}
                  />
                </Field>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
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
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(p)}
                    className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
