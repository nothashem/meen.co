# meen.co

> _We shut down our company, but we’re open-sourcing the code so others can learn, build, and benefit. Read the full story: [Why we started (and ended) this company](https://blog.hash8m.com/startedcompany.html)._

## Project Objective

meen.co was built to streamline talent discovery and candidate management, leveraging advanced LinkedIn profile crawling and AI-powered search. Our goal was to make it radically easier for teams to find, analyze, and engage with top talent—automatically.

Although the company is no longer active, we believe the technology and ideas behind meen.co can help others, so we’re releasing everything as open source.

---

## 🚀 Key Features

- **LinkedIn Profile Curling (Crawling)**
  - Our most powerful feature: fetches, caches, and analyzes full LinkedIn profiles using the Proxycurl API.
  - Profiles are embedded as vectors for fast, AI-powered similarity search.
  - Includes skills, inferred salary, contact info, and social links.
  - Profile images are fetched and cached in base64 for quick display.
  - All data is stored securely, with smart caching and expiry.
- **AI-Powered Search**
  - Search for candidates using natural language queries.
  - Results are ranked by semantic similarity, not just keywords.
- **Modern Svelte Frontend**
  - Built with SvelteKit for speed and developer experience.
  - Modular, component-driven UI.
- **Best Practices for Secrets & API Keys**
  - No secrets in the repo—everything is loaded from environment variables.
  - See `.env.example` and the [Environment Variables](#environment-variables) section below.

---

## Why Open Source?

We believe in learning in public. By sharing our code, we hope others can:
- Learn from our architecture and mistakes.
- Reuse or extend our LinkedIn crawling/search stack.
- Build new products or research on top of our work.

If you use or fork this project, let us know—we’d love to see what you build!

---

## LinkedIn Curling: The Highlight

The LinkedIn crawling (“curling”) system is the heart of meen.co. Here’s what makes it special:

- **Smart Caching:** Profiles are fetched from LinkedIn via Proxycurl, then cached in the database for fast, repeated access.
- **Rich Data:** We pull not just the basics, but skills, inferred salary, emails, phone numbers, and social profiles.
- **AI Embeddings:** Each profile is converted into a vector embedding, enabling semantic search and matching.
- **Image Handling:** Profile pictures are fetched and stored as base64, so you can display them instantly.
- **Similarity Search:** Find the best candidates for any query using vector similarity, not just text matching.

Want to see how it works? Check out [`src/lib/server/linkedin/index.ts`](src/lib/server/linkedin/index.ts).

---

## Getting Started

1. **Clone the repo**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**  
   Copy `.env.example` to `.env` and fill in your API keys (see below).
4. **Run the dev server**
   ```bash
   npm run dev
   ```

---

## Environment Variables

| Variable Name           | Purpose                                 |
|------------------------|-----------------------------------------|
| `OPENAI_API_KEY`       | OpenAI API access                       |
| `PROXYCURL_API_KEY`    | Proxycurl API access (for LinkedIn)     |
| `GOOGLE_SEARCH_API_KEY`| Google Custom Search API access         |
| `GOOGLE_CSE_ID`        | Google Custom Search Engine ID          |
| `RESEND_API_KEY`       | Resend email service                    |
| `CRAWL4AI_API_TOKEN`   | Crawler service API token               |
| `AUTH_SECRET`          | Authentication secret                   |
| `AUTH_LINKEDIN_ID`     | LinkedIn OAuth client ID                |
| `AUTH_LINKEDIN_SECRET` | LinkedIn OAuth client secret            |
| `DATABASE_URL`         | Database connection string              |

---

## License

This project is open source under the MIT License.

---

## Learn More

- [Our story: Why we started (and ended) this company](https://blog.hash8m.com/startedcompany.html)
- [Proxycurl API](https://nubela.co/proxycurl/)
- [SvelteKit](https://kit.svelte.dev/)
