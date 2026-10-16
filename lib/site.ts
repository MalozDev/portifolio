/**
 * Single source of truth for the site's canonical URL and identity.
 *
 * Set NEXT_PUBLIC_SITE_URL in your hosting environment (e.g. Vercel)
 * to your real domain, e.g. https://stephanmalobeka.vercel.app
 * The fallback keeps builds working locally before it is configured.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://my-site.vercel.app"
).replace(/\/$/, "");

export const siteName = "Stephan Malobeka";
export const siteDescription =
  "Portfolio of Stephan Malobeka (systemCall) — Computer Systems Engineering graduate from the University of Zambia. Full-stack JavaScript developer, networking & telecom engineer building real-world software and IoT solutions from Ndola, Zambia.";

export const person = {
  name: "Stephan Malobeka",
  alternateName: "systemCall",
  jobTitle: "Computer Systems Engineer & Full-Stack Developer",
  email: "mailto:malozdev@gmail.com",
  telephone: "+260975623742",
  address: {
    addressLocality: "Ndola",
    addressCountry: "ZM",
  },
  sameAs: [
    "https://github.com/MalozDev",
    "https://www.linkedin.com/in/stephan-malobeka-154a7b31b/",
  ],
} as const;
