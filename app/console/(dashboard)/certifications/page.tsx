"use client";

import { useEffect, useRef, useState } from "react";
import { Download, ExternalLink, Eye, FileText, Trash2, X } from "lucide-react";

import {
  ErrorBanner,
  Field,
  SuccessBanner,
  SubmitButton,
  inputClass,
} from "@/components/console/fields";
import { useConsoleApi } from "@/components/console/use-console-api";

interface CertItem {
  _id: string;
  title: string;
  issuer: string;
  href?: string;
  pdfFileId?: string;
  order: number;
}

interface CertForm {
  _id?: string;
  title: string;
  issuer: string;
  href: string;
  pdfFileId?: string;
  hrefDisplay?: string;
  order: number;
}

interface CvSetting {
  fileId: string | null;
  url: string;
}

const EMPTY: CertForm = { title: "", issuer: "", href: "", order: 0 };

export default function ConsoleCertificationsPage() {
  const api = useConsoleApi();
  const [items, setItems] = useState<CertItem[]>([]);
  const [preview, setPreview] = useState<CertItem | null>(null);
  const previewDialog = useRef<HTMLDialogElement>(null);
  const [cv, setCv] = useState<CvSetting>({ fileId: null, url: "/cv.pdf" });
  const [cvDraft, setCvDraft] = useState<CvSetting | null>(null);
  const [form, setForm] = useState<CertForm>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [cvUploading, setCvUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingCv, setSavingCv] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function load() {
    try {
      const [certifications, cvSetting] = await Promise.all([
        api.get<CertItem[]>("/api/admin/certifications"),
        api.get<CvSetting>("/api/admin/cv"),
      ]);
      setItems(certifications);
      setCv(cvSetting);
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

  useEffect(() => {
    const dialog = previewDialog.current;
    if (!dialog) return;
    if (preview && !dialog.open) dialog.showModal();
    if (!preview && dialog.open) dialog.close();
  }, [preview]);

  async function uploadCv(file: File) {
    setCvUploading(true);
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
      setCvDraft({ fileId: data.id, url: data.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setCvUploading(false);
    }
  }

  async function saveCv(e: React.FormEvent) {
    e.preventDefault();
    if (!cvDraft) return;

    setSavingCv(true);
    setError(null);
    setSuccess(null);
    try {
      const saved = await api.put<CvSetting>("/api/admin/cv", {
        fileId: cvDraft.fileId,
      });
      setCv(saved);
      setCvDraft(null);
      setSuccess("CV updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingCv(false);
    }
  }

  function edit(c: CertItem) {
    setForm({
      _id: c._id,
      title: c.title,
      issuer: c.issuer,
      href: c.pdfFileId ? "" : (c.href ?? ""),
      pdfFileId: c.pdfFileId,
      hrefDisplay: c.href,
      order: c.order,
    });
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setForm(EMPTY);
    setSuccess(null);
  }

  async function uploadPdf(file: File) {
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
      setForm((f) => ({ ...f, pdfFileId: data.id, hrefDisplay: data.url }));
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
        issuer: form.issuer,
        href: form.pdfFileId ? undefined : form.href || undefined,
        pdfFileId: form.pdfFileId ?? null,
        order: form.order,
      };
      if (form._id) {
        await api.put(`/api/admin/certifications/${form._id}`, payload);
        setSuccess(`Saved “${form.title}”`);
      } else {
        await api.post("/api/admin/certifications", payload);
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

  async function remove(c: CertItem) {
    if (!confirm(`Delete “${c.title}”?`)) return;
    setError(null);
    try {
      await api.del(`/api/admin/certifications/${c._id}`);
      if (form._id === c._id) setForm(EMPTY);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Certifications</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length} certification{items.length === 1 ? "" : "s"} — link the
        PDF or point to an external URL.
      </p>

      <form
        onSubmit={saveCv}
        className="mt-6 rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-base font-semibold">CV / résumé</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage the PDF linked from the home, About, and Certifications pages.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:border-brand/40 hover:text-brand">
              <FileText className="size-4" />
              {cvUploading
                ? "Uploading…"
                : cvDraft?.fileId || cv.fileId
                  ? "Replace CV PDF"
                  : "Upload CV PDF"}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={cvUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void uploadCv(file);
                  e.currentTarget.value = "";
                }}
              />
            </label>
            <a
              href={(cvDraft ?? cv).url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-brand underline-offset-4 hover:underline"
            >
              View CV ↗
            </a>
            {(cv.fileId || cvDraft?.fileId) && cvDraft?.fileId !== null && (
              <button
                type="button"
                onClick={() => setCvDraft({ fileId: null, url: "/cv.pdf" })}
                className="text-sm text-muted-foreground hover:text-destructive"
              >
                Use bundled CV
              </button>
            )}
            <SubmitButton loading={savingCv} disabled={!cvDraft || cvUploading}>
              Save CV
            </SubmitButton>
          </div>
        </div>
      </form>

      <form
        onSubmit={save}
        className="mt-6 rounded-2xl border border-border bg-card p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">
            {form._id ? `Edit: ${form.title}` : "New certification"}
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
          <Field label="Issuer">
            <input
              className={inputClass}
              value={form.issuer}
              placeholder="Cisco Networking Academy"
              onChange={(e) => setForm({ ...form, issuer: e.target.value })}
            />
          </Field>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="External URL" hint="only if no PDF">
            <input
              type="url"
              className={inputClass}
              value={form.href}
              placeholder="https://…"
              onChange={(e) => setForm({ ...form, href: e.target.value })}
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

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-medium transition-colors hover:border-brand/40 hover:text-brand">
            <FileText className="size-4" />
            {uploading ? "Uploading…" : form.pdfFileId ? "Replace PDF" : "Upload PDF"}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadPdf(file);
              }}
            />
          </label>
          {form.hrefDisplay && (
            <div className="flex items-center gap-3">
              <a
                href={form.hrefDisplay}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand underline-offset-4 hover:underline"
              >
                View current file ↗
              </a>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    pdfFileId: undefined,
                    hrefDisplay: undefined,
                  })
                }
                className="text-sm text-muted-foreground hover:text-destructive"
              >
                Remove file
              </button>
            </div>
          )}
        </div>

        <div className="mt-6">
          <SubmitButton loading={saving}>
            {form._id ? "Save changes" : "Create certification"}
          </SubmitButton>
        </div>
      </form>

      <div className="mt-4">
        <ErrorBanner error={error} />
        <SuccessBanner message={success} />
      </div>

      <h2 className="mt-10 font-display text-base font-semibold">
        All certifications
      </h2>
      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No certifications yet — create one above. (Static defaults show on the
          site until the first certification exists.)
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {items.map((c) => (
            <li
              key={c._id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
            >
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-brand/25 bg-brand/10 text-brand"
                aria-hidden="true"
              >
                <FileText className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{c.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {c.issuer}
                  {c.pdfFileId ? " · PDF attached" : c.href ? " · external link" : ""}
                </p>
              </div>
              {c.href && (
                <button
                  type="button"
                  onClick={() => setPreview(c)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1.5 text-sm text-brand hover:bg-brand/10"
                >
                  <Eye className="size-4" />
                  Preview
                </button>
              )}
              <button
                type="button"
                onClick={() => edit(c)}
                className="shrink-0 rounded-md px-2.5 py-1.5 text-sm text-brand hover:bg-brand/10"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(c)}
                aria-label={`Delete ${c.title}`}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={previewDialog}
        aria-labelledby="certification-preview-title"
        onClose={() => setPreview(null)}
        className="m-auto max-h-[92dvh] w-[min(96vw,64rem)] max-w-none overflow-hidden rounded-xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/75"
      >
        {preview?.href && (
          <div className="flex max-h-[92dvh] flex-col">
            <div className="flex items-start justify-between gap-4 border-b border-border p-4 sm:px-6">
              <div className="min-w-0">
                <h2
                  id="certification-preview-title"
                  className="truncate font-display text-base font-semibold"
                >
                  {preview.title}
                </h2>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {preview.issuer}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={
                    preview.pdfFileId
                      ? `/api/media/${preview.pdfFileId}?download=1`
                      : preview.href
                  }
                  download={preview.pdfFileId || preview.href.startsWith("/") ? true : undefined}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-brand px-3 text-sm font-medium text-primary-foreground hover:bg-brand-dim"
                >
                  <Download className="size-4" />
                  Download
                </a>
                <a
                  href={preview.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open certificate in a new tab"
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="size-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  aria-label="Close preview"
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
            <iframe
              src={preview.href}
              title={`${preview.title} preview`}
              className="h-[72dvh] min-h-80 w-full bg-background"
            />
          </div>
        )}
      </dialog>
    </div>
  );
}
