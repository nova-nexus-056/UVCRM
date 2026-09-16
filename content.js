/* Vibe Roadmap — content.js */

window.VIBE_DATA = {
  meta: {
    title: "Vibe Roadmap",
    lastUpdated: "September 2026"
  },

  principles: [
    { num: 1, title: "AI is a multiplier, not a substitute.", body: "If you can't read and debug what the AI wrote, you don't have the skill yet — you have a dependency. Learn to understand before you learn to accept." },
    { num: 2, title: "Ship beats perfect.", body: "An ugly, deployed, working app teaches 10× more than a beautiful local prototype that never saw the light of day." },
    { num: 3, title: "Read the error message.", body: "AI can fix bugs, but only if you paste the actual error. Learn to read a stack trace — it's the single highest-leverage skill in modern development." },
    { num: 4, title: "Know your stack, even vaguely.", body: "You don't need to be an expert. But if you can't explain what Next.js vs. plain React vs. plain HTML actually is, you can't debug AI's choices when they're wrong." },
    { num: 5, title: "Version control from day one.", body: "Commit early, commit often. When AI breaks something (it will), a clean Git history is your undo button." },
    { num: 6, title: "Read the parts that matter.", body: "Let AI write the boilerplate. Read the auth code, the payment code, and anything touching user data. That's where bugs hurt." },
    { num: 7, title: "Zero-budget is valid — up to a point.", body: "Free tiers get you to launch. The moment you have real users, invest in proper infra. Don't build a $10k/month app on a hobby free tier." }
  ],

  parts: [
    {
      number: 1,
      title: "Foundations",
      range: "0–3",
      phases: [
        {
          id: "phase-0",
          number: 0,
          title: "What is Vibe Coding (Really)?",
          difficulty: "Beginner",
          time: "1–2 days",
          prerequisites: "None",
          teaser: "Most people misunderstand what vibe coding actually is. It's not 'don't learn to code' — it's a specific workflow where AI handles execution while you stay responsible for outcome.",
          milestoneHtml: "You can explain, in your own words, the difference between vibe coding and traditional coding — and where the boundary is.",
          nextLabel: "Phase 1 — Your AI Toolkit",
          bodyHtml: "<p><strong>Why it matters:</strong> The term gets thrown around a lot. Some people use it to mean \"I don't need to learn anything.\" Others mean \"I use AI heavily but still understand my codebase.\" The first group ships bugs they can't fix; the second group ships products. Be the second group.</p><p><strong>What you'll learn:</strong></p><ul><li>Where the term came from (Andrej Karpathy, early 2025) and what it actually described</li><li>The spectrum: full-auto vibe coding vs. AI-assisted professional development</li><li>What AI is genuinely better at (boilerplate, scaffolding, refactoring, exploring unfamiliar APIs)</li><li>What AI is genuinely worse at (subtle logic bugs, security decisions, architecture trade-offs, understanding your business requirements)</li><li>Why \"just prompt harder\" stops working past a certain complexity</li></ul><p><strong>Practice:</strong> Write a one-page note in your own words: \"Vibe coding is X, but it stops working when Y.\" Save it. Revisit it after Phase 8.</p>"
        },
        {
          id: "phase-1",
          number: 1,
          title: "Your AI Toolkit Setup",
          difficulty: "Beginner",
          time: "2–3 days",
          prerequisites: "Phase 0",
          teaser: "There are five categories of AI dev tools in 2026, and they solve different problems. Picking the wrong one for the wrong task is a huge time sink.",
          milestoneHtml: "You have one tool from each category installed and configured, and can explain when you'd reach for which.",
          nextLabel: "Phase 2 — Prompt Engineering",
          bodyHtml: "<p><strong>Why it matters:</strong> \"AI tools\" is not one thing. An AI editor, a chat interface, an agent that runs commands, and an in-browser app builder are completely different beasts. Vibe coders who only know one type get stuck fast.</p><p><strong>The five categories:</strong></p><ul><li><strong>AI-native editors:</strong> Cursor, Windsurf, VS Code + Copilot. You edit code, AI suggests inside the file.</li><li><strong>Chat interfaces:</strong> Claude, ChatGPT, Gemini. You ask questions, paste errors, get explanations. Best for learning and debugging.</li><li><strong>Terminal agents:</strong> Claude Code, Aider, OpenAI Codex CLI. AI runs commands, edits files, executes tests — directly on your machine.</li><li><strong>Browser app builders:</strong> v0, Bolt, Lovable, Replit Agent. Describe an app, get a working prototype. Best for zero-to-one demos.</li><li><strong>Code review AI:</strong> CodeRabbit, Greptile, Cursor's built-in review. Reviews your PRs like a senior dev.</li></ul><p><strong>Practice:</strong> Build the same trivial app (a to-do list) using three different categories. Notice where each one shines and where it falls apart.</p>"
        },
        {
          id: "phase-2",
          number: 2,
          title: "Prompt Engineering for Developers",
          difficulty: "Beginner",
          time: "1–2 weeks",
          prerequisites: "Phase 1",
          teaser: "Prompt engineering isn't about magic words. It's about giving AI enough context to make good decisions on your behalf — and being specific about constraints.",
          milestoneHtml: "You can get a functional first draft of a non-trivial feature from a single well-crafted prompt, without back-and-forth.",
          nextLabel: "Phase 3 — Your First Real App",
          bodyHtml: "<p><strong>Why it matters:</strong> The difference between a 3-minute fix and a 3-hour yak-shave is usually the quality of the prompt. This isn't a soft skill — it directly affects your velocity.</p><p><strong>What you'll learn:</strong></p><ul><li>The core pattern: <strong>Role + Context + Task + Constraints + Output format</strong></li><li>Providing file context (@-mentions in Cursor, file references in Claude)</li><li>Asking AI to <em>propose a plan first</em> for non-trivial work</li><li>Iterating with specific feedback vs. vague \"it doesn't work\"</li><li>Few-shot examples for AI-generated code that must match a style</li><li>Why \"act as a senior engineer\" barely helps, but \"here are 3 constraints you must not violate\" helps a lot</li></ul><p><strong>Practice:</strong> Take one small feature and rewrite its prompt five times, each version more specific. Track which version required the fewest follow-ups.</p>"
        },
        {
          id: "phase-3",
          number: 3,
          title: "Your First Real App (Not a Demo)",
          difficulty: "Beginner",
          time: "2–3 weeks",
          prerequisites: "Phase 2",
          teaser: "The first app you build with AI will be amazing for about 2 days. Then it'll hit the wall — and how you handle the wall determines whether you become a real vibe coder or a demo-only one.",
          milestoneHtml: "You've shipped a real app with at least one non-trivial feature that AI couldn't one-shot — you had to debug and fix it yourself.",
          nextLabel: "Phase 4 — Reading & Debugging AI Code",
          bodyHtml: "<p><strong>Why it matters:</strong> Tutorial apps and personal projects are one thing. Shipping to real users, where something breaks and you can't just \"regenerate the whole file,\" is where you actually level up.</p><p><strong>What you'll learn:</strong></p><ul><li>Project scaffolding: how to start a project AI can actually reason about (folder structure, config files, naming)</li><li>Incremental delivery: building feature-by-feature with AI, not \"generate the whole app in one prompt\"</li><li>Reading every line of AI's first draft on critical paths</li><li>When to accept AI's suggestion vs. when to override</li><li>Committing early and often — how a clean Git history becomes your safety net</li></ul><p><strong>Practice projects (pick one):</strong></p><ul><li>A habit tracker with local storage and a shareable link</li><li>A URL shortener with a simple dashboard</li><li>A markdown notebook with tags and search</li></ul>"
        }
      ]
    },
    {
      number: 2,
      title: "Building With AI",
      range: "4–7",
      phases: [
        {
          id: "phase-4",
          number: 4,
          title: "Reading & Debugging AI Code",
          difficulty: "Intermediate",
          time: "2–3 weeks",
          prerequisites: "Phase 3",
          teaser: "This is the phase that separates vibe coders who ship from vibe coders who get stuck. AI-generated code has specific, recurring failure patterns — once you know them, you see them coming.",
          milestoneHtml: "You can look at a piece of AI code that's not working, form a hypothesis about why, and test it — without asking AI to \"just fix it.\"",
          nextLabel: "Phase 5 — Choosing a Stack",
          bodyHtml: "<p><strong>Why it matters:</strong> AI writes code confidently, even when it's wrong. The bugs in AI code are often subtler than beginner bugs — they look plausible, they follow conventions, they use real APIs. Learning to spot them is the whole game.</p><p><strong>Recurring failure patterns to watch for:</strong></p><ul><li><strong>Hallucinated APIs:</strong> functions and methods that don't exist, or don't do what AI thinks they do</li><li><strong>Outdated patterns:</strong> using the 2022 way of doing something when the library changed in 2025</li><li><strong>Plausible-looking logic bugs:</strong> off-by-one errors, wrong variable, incorrect error handling</li><li><strong>Security omissions:</strong> missing input validation, tokens in localStorage, SQL injection surfaces</li><li><strong>Race conditions:</strong> subtle async bugs that only appear under load</li><li><strong>Over-engineering:</strong> five layers of abstraction for a 20-line requirement</li></ul><p><strong>Debugging workflow:</strong></p><ul><li>Read the error message — actually read it, don't skim</li><li>Reproduce the bug reliably</li><li>Form a hypothesis before asking AI</li><li>Isolate the smallest failing case</li><li>Ask AI to explain the code first, then to fix it</li></ul>"
        },
        {
          id: "phase-5",
          number: 5,
          title: "Choosing a Stack (Without Overthinking It)",
          difficulty: "Intermediate",
          time: "1 week + ongoing",
          prerequisites: "Phase 4",
          teaser: "You don't need the perfect stack. You need a stack you can debug. AI can build in almost anything — but you need to understand enough to catch when it goes wrong.",
          milestoneHtml: "You can explain what each piece of your stack does, and why you chose it over one alternative.",
          nextLabel: "Phase 6 — Databases Without a DBA",
          bodyHtml: "<p><strong>Why it matters:</strong> \"What stack should I use?\" is the wrong question. The right one is: \"What stack can I debug when things go wrong?\"</p><p><strong>Default vibe-coder stack (2026):</strong></p><ul><li><strong>Framework:</strong> Next.js — huge community, AI knows it deeply, deploys anywhere</li><li><strong>Language:</strong> TypeScript — catches entire categories of bugs before runtime</li><li><strong>Styling:</strong> Tailwind CSS + shadcn/ui — dominant, well-documented</li><li><strong>Database:</strong> Supabase (Postgres + auth + storage bundled) or Firebase</li><li><strong>Deployment:</strong> Vercel (frontend + serverless) or Railway/Render</li><li><strong>Auth:</strong> Whatever your DB gives you — don't roll your own</li></ul><p><strong>Alternative stacks that are also fine:</strong></p><ul><li>SvelteKit + Supabase (lighter, faster, smaller ecosystem)</li><li>Plain HTML/CSS/JS + Firebase (simplest)</li><li>Vue + Nuxt + any backend</li></ul>"
        },
        {
          id: "phase-6",
          number: 6,
          title: "Databases Without a DBA",
          difficulty: "Intermediate",
          time: "1–2 weeks",
          prerequisites: "Phase 5",
          teaser: "You don't need to be a database expert. You need to know enough to spot when AI is about to do something dangerously expensive or insecure.",
          milestoneHtml: "You can design a small schema from a plain-English description, explain your relationship choices, and add at least one index deliberately.",
          nextLabel: "Phase 7 — Deployment Made Simple",
          bodyHtml: "<p><strong>Why it matters:</strong> Databases are where naive vibe coding causes the most expensive mistakes — from $500 surprise bills to data leaks caused by missing security rules.</p><p><strong>What you'll learn:</strong></p><ul><li>Relational vs. document databases — when each fits (hint: default to relational)</li><li>What a schema actually is, and why AI needs to know yours before generating queries</li><li>Row Level Security (RLS) in Supabase / Firestore Rules — the difference between \"my app works\" and \"my app is a data leak\"</li><li>Indexes: what they are, when AI-generated queries need one</li><li>The N+1 query problem — a classic AI-generated performance bug</li><li>Backup strategy: Supabase's automatic backups vs. you need to set them up yourself</li></ul><p><strong>Practice:</strong> Design a schema for a small social feature (posts + likes + comments). Write out the tables and relationships by hand before AI does.</p>"
        },
        {
          id: "phase-7",
          number: 7,
          title: "Deployment Made Simple",
          difficulty: "Intermediate",
          time: "3–5 days",
          prerequisites: "Phase 6",
          teaser: "Deploying shouldn't be scary. But it's also not optional — an app that only runs on your laptop isn't shipped software.",
          milestoneHtml: "You have a real app live on a real domain, with HTTPS, that you can redeploy confidently without googling.",
          nextLabel: "Phase 8 — When to Leave the Vibe",
          bodyHtml: "<p><strong>Why it matters:</strong> Deployment is the moment your project becomes real. It's also where most vibe coders quit — usually because the first deploy fails and they don't know why.</p><p><strong>What you'll learn:</strong></p><ul><li>GitHub + Vercel workflow: push to deploy, preview URLs, instant rollbacks</li><li>Environment variables: where to set them (Vercel dashboard, not in code)</li><li>Custom domains: buying one, pointing DNS, waiting for HTTPS to propagate</li><li>Reading deploy logs when something fails</li><li>Staging vs. production: when you need both (earlier than you think)</li><li>Free-tier limits you'll actually hit: function execution time, bandwidth, database connections</li></ul><p><strong>Practice:</strong> Deploy your Phase 3 app to Vercel on a real custom domain. Then push a change, watch the auto-deploy, and roll back if needed.</p>"
        }
      ]
    },
    {
      number: 3,
      title: "Leveling Up",
      range: "8–10",
      phases: [
        {
          id: "phase-8",
          number: 8,
          title: "When to Leave the Vibe (Write Code By Hand)",
          difficulty: "Advanced",
          time: "Ongoing",
          prerequisites: "Phase 7",
          teaser: "Counterintuitive but true: the best vibe coders write more code by hand than the average developer, not less. They just know exactly which 5% matters.",
          milestoneHtml: "You can point to a specific piece of code in your project that you wrote 100% yourself — because it was too important to trust to AI.",
          nextLabel: "Phase 9 — Testing AI Code",
          bodyHtml: "<p><strong>Why it matters:</strong> There are things AI gets subtly wrong in ways you'll never catch by reading the generated code. Auth, payments, and anything touching user data are the big three.</p><p><strong>When to write by hand:</strong></p><ul><li><strong>Auth logic:</strong> Session handling, token validation, permission checks. AI gets this right 80% of the time — and 80% is not enough.</li><li><strong>Payment flows:</strong> Idempotency, refund logic, webhook handling. Bugs here cost real money.</li><li><strong>Data migration scripts:</strong> One-off scripts where you have one shot to get it right.</li><li><strong>Security-critical code:</strong> Anything that decides what a user is allowed to see or do.</li><li><strong>Core business logic:</strong> The thing your app is actually about.</li></ul><p><strong>When AI is genuinely great:</strong></p><ul><li>Boilerplate and scaffolding</li><li>Refactoring existing code</li><li>Writing tests (with review)</li><li>Exploring unfamiliar libraries</li><li>Generating UI components from descriptions</li></ul><p><strong>Practice:</strong> Pick one critical function in your app and rewrite it from scratch yourself, without AI. Then diff it against what AI generated.</p>"
        },
        {
          id: "phase-9",
          number: 9,
          title: "Testing AI-Generated Code",
          difficulty: "Advanced",
          time: "1–2 weeks",
          prerequisites: "Phase 8",
          teaser: "You can't read every line of AI code carefully. But you can test it — and tests are exactly what lets you trust AI's output at scale.",
          milestoneHtml: "Your main project has at least a small test suite that runs on every push and catches regressions.",
          nextLabel: "Phase 10 — Security for Vibe Coders",
          bodyHtml: "<p><strong>Why it matters:</strong> Tests aren't about proving code works. They're about making it <em>safe to change</em>. When AI refactors your code (it will), tests are how you know nothing broke.</p><p><strong>What you'll learn:</strong></p><ul><li>Writing tests as specs of behavior, not implementation</li><li>Vitest or Jest for unit tests (fast, local)</li><li>React Testing Library for component behavior</li><li>Playwright for a couple of critical end-to-end flows (signup, login, main feature)</li><li>Running tests in CI via GitHub Actions — every push gets tested automatically</li><li>The 80/20: test critical paths heavily, ignore coverage numbers</li></ul><p><strong>Prompt pattern for test generation:</strong></p><p><code>\"Write tests for this function. Only test observable behavior, not implementation. Cover: happy path, boundary cases, and at least one error case. Use Vitest. Do not mock unless absolutely necessary.\"</code></p>"
        },
        {
          id: "phase-10",
          number: 10,
          title: "Security for Vibe Coders",
          difficulty: "Advanced",
          time: "1 week + ongoing",
          prerequisites: "Phase 9",
          teaser: "You don't need to be a security engineer. You need to know the five mistakes that cause 90% of breaches in small apps — and how to check for them.",
          milestoneHtml: "You've run a security checklist against your main project and fixed at least three real issues you found.",
          nextLabel: "Phase 11 — AI Agents",
          bodyHtml: "<p><strong>Why it matters:</strong> AI is trained on public code, and public code is full of security mistakes. When you ask AI to \"add login,\" it might give you a version that's subtly vulnerable. You need to know the checklist.</p><p><strong>The five that matter most:</strong></p><ul><li><strong>Exposed secrets:</strong> API keys in client code, in Git, in logs. Use environment variables. Rotate any key that ever leaked.</li><li><strong>Missing authorization:</strong> Your API returns user A's data to user B. Always check <em>both</em> authentication (who) and authorization (allowed to).</li><li><strong>Injection:</strong> Never build SQL or shell commands by string concatenation. Use parameterized queries / ORMs.</li><li><strong>XSS:</strong> Never render user input as HTML. Use your framework's escape-by-default patterns.</li><li><strong>Broken auth flows:</strong> Rate-limit login attempts; don't leak whether an email exists; require re-authentication for destructive actions.</li></ul><p><strong>Free resources:</strong></p><ul><li>OWASP Top 10 (official list, updated 2025)</li><li>PortSwigger Web Security Academy (free labs)</li><li>OWASP Juice Shop (deliberately vulnerable app for practice)</li></ul><p><strong>Practice:</strong> Run a checklist review of your main project against OWASP Top 10. Fix what you find.</p>"
        }
      ]
    },
    {
      number: 4,
      title: "Shipping & Beyond",
      range: "11–12",
      phases: [
        {
          id: "phase-11",
          number: 11,
          title: "AI Agents (The Next Level)",
          difficulty: "Advanced",
          time: "2–3 weeks",
          prerequisites: "Phase 10",
          teaser: "Terminal agents like Claude Code, Aider, and Codex CLI are a step change. They don't just suggest — they execute. Knowing when to trust them is a skill in itself.",
          milestoneHtml: "You've used a terminal agent for at least one non-trivial task (refactor, migration, or feature) and have a workflow for reviewing its output.",
          nextLabel: "Phase 12 — Launching & Monetizing",
          bodyHtml: "<p><strong>Why it matters:</strong> Editor assistants suggest within a file. Terminal agents plan multi-file changes, run tests, read outputs, and iterate — sometimes for many minutes autonomously. Used well, they're a massive lever. Used carelessly, they're how you accidentally delete your database.</p><p><strong>What you'll learn:</strong></p><ul><li>Claude Code, Aider, Codex CLI, Cursor Composer — the current landscape</li><li>How to scope agent tasks so they don't go off the rails</li><li>Reading the plan before letting the agent execute (yes, always)</li><li>Sandboxing: run agents in Docker or a VM for anything destructive</li><li>Version control discipline: commit before every agent task, revert freely</li><li>When agents are <em>worse</em> than manual editing (small, precise changes; unfamiliar codebases; anything touching money or auth)</li></ul><p><strong>Practice:</strong> Give a terminal agent a well-scoped task (\"refactor this file to extract a helper, keep all tests passing\"). Watch the entire process. Then review the diff line by line.</p>"
        },
        {
          id: "phase-12",
          number: 12,
          title: "Launching & Monetizing Solo",
          difficulty: "Advanced",
          time: "Ongoing",
          prerequisites: "Phase 11",
          teaser: "The final phase: getting real users, charging real money, and staying sane while doing it solo. This is where you find out what your product actually is.",
          milestoneHtml: "You've launched something publicly and have at least one real user (not you, not your mom) who isn't actively annoyed by it.",
          nextLabel: null,
          bodyHtml: "<p><strong>Why it matters:</strong> Vibe coding makes it easy to build. It doesn't make it easy to find users, get feedback, and turn any of it into a business. That's a separate skill — and often harder than the code.</p><p><strong>What you'll learn:</strong></p><ul><li>Getting first users: launching on Product Hunt, Indie Hackers, relevant communities</li><li>Reading user feedback without taking it personally</li><li>Firing features nobody uses (this hurts)</li><li>Payment processing: Stripe basics, why test mode first, webhook handling</li><li>Pricing: starting higher than you think, and why</li><li>The \"boring infrastructure\" phase: proper monitoring, error tracking (Sentry), analytics</li><li>When to stop building and start maintaining</li><li>Burnout: the real reason solo founders quit</li></ul><p><strong>Practice:</strong> Ship a small paid feature ($5/month) to your app. Notice every part of the process that's not code.</p>"
        }
      ]
    }
  ],

  kit: [
    {
      id: "appendix-a",
      letter: "A",
      title: "AI Tools Master List",
      plainText: "Every category of AI dev tool, the leading options in each, and when to reach for which.",
      bodyHtml: "<p><strong>Editors</strong> — Cursor, Windsurf, VS Code + GitHub Copilot, Zed. Pick one and stick with it; switching constantly kills momentum.</p><p><strong>Chat interfaces</strong> — Claude (best for nuanced reasoning), ChatGPT (best for general use), Gemini (best integration with Google services). Use for debugging, explaining code, and thinking through architecture.</p><p><strong>Terminal agents</strong> — Claude Code (most mature), Aider (open source, git-native), OpenAI Codex CLI (fast, cheap). Best for multi-file refactors, migrations, and well-scoped feature work.</p><p><strong>Browser app builders</strong> — v0 (best for React components), Bolt (full apps), Lovable (fastest zero-to-one), Replit Agent (best for education/hobby). Great for prototypes, less good for long-lived production code.</p><p><strong>Code review AI</strong> — CodeRabbit, Greptile, Cursor's review mode, GitHub Copilot for PRs. Best for catching issues before they land.</p><p><strong>Disclosure note:</strong> AI tool capabilities and pricing change monthly. Re-verify before committing to any paid tier.</p>"
    },
    {
      id: "appendix-b",
      letter: "B",
      title: "Prompt Patterns Library",
      plainText: "Reusable prompt templates for the most common vibe-coding tasks: feature work, debugging, refactoring, and review.",
      bodyHtml: "<p class='md-subhead'>Pattern 1 — Scoped feature work</p><p>\"Read [file A] and [file B] first. I need a new [feature]. Constraints: (1) must not change the public API of [existing function], (2) must handle [edge case], (3) must use [existing pattern]. Propose a plan before writing code.\"</p><p class='md-subhead'>Pattern 2 — Debugging</p><p>\"Here's the error: [paste full stack trace]. Here's the relevant code: [paste]. Here's what I expected to happen: [expected]. Here's what actually happened: [actual]. Don't fix it yet — explain what you think is going wrong.\"</p><p class='md-subhead'>Pattern 3 — Refactoring</p><p>\"Refactor this function to reduce complexity. Preserve the exact external behavior — all current tests must pass unchanged. Explain your approach before editing.\"</p><p class='md-subhead'>Pattern 4 — Code review</p><p>\"Review this diff as a senior engineer. Focus on: bugs, security issues, missing edge cases, and anything that will break at scale. Ignore style.\"</p><p class='md-subhead'>Pattern 5 — Learning</p><p>\"Explain this code to me as if I've never seen [technology] before. Then tell me 3 ways it could fail in production that a beginner wouldn't notice.\"</p>"
    },
    {
      id: "appendix-c",
      letter: "C",
      title: "Stack Recipes",
      plainText: "Five common vibe-coder stacks, what each is best for, and the tradeoffs.",
      bodyHtml: "<p><strong>Recipe 1 — Modern web app (default):</strong> Next.js + TypeScript + Tailwind + shadcn/ui + Supabase + Vercel. Best for 80% of projects. Huge community, AI knows it deeply.</p><p><strong>Recipe 2 — Simplest possible:</strong> Plain HTML + CSS + Vanilla JS + Firebase. Best for small tools, learning, and pure static sites. Zero build step.</p><p><strong>Recipe 3 — Fastest prototype:</strong> Bolt or v0 + Supabase. Best for validating an idea in a day. Not for production.</p><p><strong>Recipe 4 — Backend-heavy:</strong> Next.js + tRPC + PostgreSQL (Railway) + Prisma. Best when you have complex server logic. More setup, more control.</p><p><strong>Recipe 5 — Mobile-first:</strong> Expo (React Native) + Supabase. Best when you need native apps and web from one codebase.</p>"
    },
    {
      id: "appendix-d",
      letter: "D",
      title: "Common Vibe-Coder Mistakes",
      plainText: "The recurring mistakes that turn a promising vibe-coding session into a 3-hour debugging nightmare — and how to avoid each.",
      bodyHtml: "<ul><li><strong>Regenerating everything</strong> instead of fixing the specific bug. AI's second version often introduces new problems.</li><li><strong>Not committing before big changes.</strong> AI just refactored 12 files and broke 3? You have no way back without Git.</li><li><strong>Trusting \"I fixed it\"</strong> without running the app yourself. AI is confidently wrong about its own changes.</li><li><strong>Pasting the whole file</strong> as context when 10 lines would do. Overload makes AI worse, not better.</li><li><strong>Letting AI choose the architecture.</strong> It'll pick something plausible and generic. You should pick something specific to your problem.</li><li><strong>Ignoring security warnings</strong> because \"it's just a side project.\" Side projects become real projects. Build the habit.</li><li><strong>Never reading the code.</strong> You'll hit a wall around month 2 where AI can't fix its own mess, and you won't know why.</li><li><strong>Deploying without testing</strong> in a browser other than your own. AI-generated code often works in dev and breaks in production.</li><li><strong>Chasing tool hype.</strong> The tool matters less than the workflow. Master one editor before trying a fifth.</li><li><strong>Not asking \"why\"</strong> when AI gives you code. Understanding the reasoning is how you get better at prompting and debugging.</li></ul>"
    }
  ],

  faq: [
    {
      q: "Do I need to learn to code to be a vibe coder?",
      aHtml: "<p>Yes — but less than traditional developers, and differently. You need to <em>read</em> code, debug it, and understand enough of your stack to make good decisions. You don't need to know how to write a red-black tree from scratch. Think \"fluent reader\" more than \"fluent writer.\"</p>",
      plainText: "Do I need to learn to code to be a vibe coder? Yes — but less than traditional developers. You need to read code and debug it."
    },
    {
      q: "What's the biggest mistake vibe coders make?",
      aHtml: "<p>Not reading AI code. Ever. It works for 2–4 weeks, then something breaks in a way AI can't fix, and you have no mental model to debug from. Read the critical paths. Understand what you shipped.</p>",
      plainText: "What's the biggest mistake vibe coders make? Not reading AI code. Ever."
    },
    {
      q: "Which AI tool should I use?",
      aHtml: "<p>For editors: Cursor or Windsurf. For chat/debugging: Claude. For terminal agents: Claude Code or Aider. For prototypes: v0 or Bolt. Pick one per category, stick with it for a month, then evaluate. Switching tools constantly is a form of procrastination.</p>",
      plainText: "Which AI tool should I use? Cursor for editor, Claude for chat, Claude Code for terminal."
    },
    {
      q: "Can I really ship to production with vibe coding?",
      aHtml: "<p>Yes, with caveats. Read the security-critical code. Test on real devices. Set up error tracking. Use environment variables for secrets. Ship small. The vibe coder who does these things can ship at remarkable speed.</p>",
      plainText: "Can I really ship to production with vibe coding? Yes, with caveats."
    },
    {
      q: "How do I stay current when AI tools change monthly?",
      aHtml: "<p>Don't chase every release. Follow 2–3 high-signal sources (Simon Willison's blog, the Latent Space podcast, and your AI editor's changelog) and skim monthly, not daily. The fundamentals of prompt engineering, debugging, and shipping don't change.</p>",
      plainText: "How do I stay current when AI tools change monthly? Don't chase every release."
    },
    {
      q: "Am I cheating by using AI so heavily?",
      aHtml: "<p>No. Every working developer in 2026 uses AI daily, to some degree. The question isn't <em>whether</em> you use it — it's whether you understand what you shipped well enough to maintain it. If yes, you're not cheating. You're modern.</p>",
      plainText: "Am I cheating by using AI so heavily? No. Every working developer in 2026 uses AI daily."
    }
  ],

  closingHtml: "Vibe coding is real. It's fast, it's fun, and it lets one person ship what used to take a team. But the coders who last aren't the ones who prompt best — they're the ones who <em>read</em> what AI wrote, <em>understand</em> what they shipped, and <em>fix</em> things when they break. Ship small. Ship often. Read the code that matters. And keep going."
};