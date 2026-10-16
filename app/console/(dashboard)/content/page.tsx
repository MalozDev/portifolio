"use client";

import { useEffect, useState } from "react";

import {
  ErrorBanner,
  Field,
  SuccessBanner,
  SubmitButton,
  inputClass,
  textareaClass,
} from "@/components/console/fields";
import { useConsoleApi } from "@/components/console/use-console-api";

interface ContentDoc {
  hero: { roles: string[]; bio: string; availability: string };
  about: { intro: string[]; quote: string };
  journey: { stage: string; title: string; note: string; items: string[] }[];
  leadership: { title: string; detail: string }[];
  languages: { name: string; label: string; level: number }[];
  competencies: string[];
  marquee: string[];
}

interface Draft {
  roles: string;
  bio: string;
  availability: string;
  intro: string;
  quote: string;
  journeyJson: string;
  leadershipJson: string;
  languagesJson: string;
  competencies: string;
  marquee: string;
}

function toDraft(c: ContentDoc): Draft {
  return {
    roles: c.hero.roles.join("\n"),
    bio: c.hero.bio,
    availability: c.hero.availability,
    intro: c.about.intro.join("\n\n"),
    quote: c.about.quote,
    journeyJson: JSON.stringify(c.journey, null, 2),
    leadershipJson: JSON.stringify(c.leadership, null, 2),
    languagesJson: JSON.stringify(c.languages, null, 2),
    competencies: c.competencies.join("\n"),
    marquee: c.marquee.join(", "),
  };
}

export default function ConsoleContentPage() {
  const api = useConsoleApi();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const content = await api.get<ContentDoc>("/api/admin/content");
        setDraft(toDraft(content));
      } catch (e) {
        if (!(e instanceof Error && e.message === "Unauthorized")) {
          setError(e instanceof Error ? e.message : "Failed to load");
        }
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  function parseJson<T>(raw: string): T {
    return JSON.parse(raw) as T;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;

    // Validate JSON sections before sending.
    let journey, leadership, languages;
    try {
      journey = parseJson<ContentDoc["journey"]>(draft.journeyJson);
      leadership = parseJson<ContentDoc["leadership"]>(draft.leadershipJson);
      languages = parseJson<ContentDoc["languages"]>(draft.languagesJson);
    } catch {
      setError("One of the JSON sections has a syntax error — fix it and retry.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await api.put("/api/admin/content", {
        hero: {
          roles: draft.roles.split("\n").map((r) => r.trim()).filter(Boolean),
          bio: draft.bio,
          availability: draft.availability,
        },
        about: {
          intro: draft.intro.split("\n\n").map((p) => p.trim()).filter(Boolean),
          quote: draft.quote,
        },
        journey,
        leadership,
        languages,
        competencies: draft.competencies.split("\n").map((c) => c.trim()).filter(Boolean),
        marquee: draft.marquee.split(",").map((m) => m.trim()).filter(Boolean),
      });
      setSuccess("Site content saved — live everywhere immediately.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !draft) {
    return (
      <div>
        <h1 className="font-display text-2xl font-bold">Site Content</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {error ? "Failed to load content." : "Loading…"}
        </p>
        <ErrorBanner error={error} />
      </div>
    );
  }

  return (
    <form onSubmit={save}>
      <h1 className="font-display text-2xl font-bold">Site Content</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Edit the text shown across your portfolio. Saves go live immediately.
      </p>

      <div className="mt-4">
        <ErrorBanner error={error} />
        <SuccessBanner message={success} />
      </div>

      {/* Hero */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-base font-semibold">Hero (home page)</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Availability badge">
            <input
              className={inputClass}
              value={draft.availability}
              onChange={(e) => set("availability", e.target.value)}
            />
          </Field>
          <Field label="Rotating roles" hint="one per line">
            <textarea
              className={textareaClass}
              value={draft.roles}
              onChange={(e) => set("roles", e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Bio paragraph">
            <textarea
              className={textareaClass}
              value={draft.bio}
              onChange={(e) => set("bio", e.target.value)}
            />
          </Field>
        </div>
      </section>

      {/* About */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-base font-semibold">About page</h2>
        <div className="mt-4">
          <Field label="Intro paragraphs" hint="separated by blank lines">
            <textarea
              className={textareaClass}
              value={draft.intro}
              onChange={(e) => set("intro", e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Why I build quote">
            <textarea
              className={textareaClass}
              value={draft.quote}
              onChange={(e) => set("quote", e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Field label="Learning journey" hint="JSON array">
            <textarea
              className={`${textareaClass} font-mono text-xs`}
              value={draft.journeyJson}
              onChange={(e) => set("journeyJson", e.target.value)}
            />
          </Field>
          <Field label="Leadership" hint="JSON array">
            <textarea
              className={`${textareaClass} font-mono text-xs`}
              value={draft.leadershipJson}
              onChange={(e) => set("leadershipJson", e.target.value)}
            />
          </Field>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Field label="Languages" hint="JSON array (level 0-100)">
            <textarea
              className={`${textareaClass} font-mono text-xs`}
              value={draft.languagesJson}
              onChange={(e) => set("languagesJson", e.target.value)}
            />
          </Field>
          <div className="space-y-4">
            <Field label="Core competencies" hint="one per line">
              <textarea
                className={textareaClass}
                value={draft.competencies}
                onChange={(e) => set("competencies", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-base font-semibold">
          Tech marquee (home page)
        </h2>
        <div className="mt-4">
          <Field label="Items" hint="comma separated">
            <textarea
              className={textareaClass}
              value={draft.marquee}
              onChange={(e) => set("marquee", e.target.value)}
            />
          </Field>
        </div>
      </section>

      <div className="mt-6">
        <SubmitButton loading={saving}>Save all content</SubmitButton>
      </div>
    </form>
  );
}
