# Adding a New Course to EliteFolks

> This guide is for AI assistants and developers adding new courses to the platform.
> Follow every step exactly to ensure 100% accuracy and data integrity.

---

## Overview

Courses are stored as **JSON files** in `app/courses/` and seeded into the **Supabase database**. The frontend reads from the database at runtime.

```
app/courses/
├── [course-name].json          ← Course data (modules + lessons)
├── page.tsx                    ← Courses listing page (auto-reads from DB)
├── [courseId]/page.tsx          ← Course detail + syllabus page
├── [courseId]/lessons/[lessonId]/page.tsx  ← Lesson viewer
└── ADDING_COURSES.md           ← This guide
```

---

## Step-by-Step Process

### 1. Create the Course JSON File

Create `app/courses/[course-slug].json` following the exact schema below.

### 2. Validate the JSON

```bash
node -e "JSON.parse(require('fs').readFileSync('app/courses/YOUR_FILE.json','utf-8')); console.log('Valid JSON')"
```

### 3. Verify Structure

```bash
node -e "var d=JSON.parse(require('fs').readFileSync('app/courses/YOUR_FILE.json','utf-8')); console.log('Modules:',d.modules.length); d.modules.forEach(function(m){console.log(m.order+'. '+m.title+' ('+m.lessons.length+' lessons, slug: '+m.slug+')');})"
```

### 4. Seed to Supabase

```bash
npx tsx scripts/seed-course-json.ts app/courses/YOUR_FILE.json
```

The seed script uses **upsert** (insert or update), so it's safe to re-run.

### 5. Audit the Database

```bash
npx tsx scripts/audit-db.ts
```

Must show **0 issues** before deploying.

### 6. Push to Git

```bash
git add app/courses/YOUR_FILE.json
git commit -m "feat: add [Course Name] course"
git push origin main
```

---

## JSON Schema Reference

### Top-Level Structure

```json
{
  "course": {
    "slug": "javascript-zero-to-hero",
    "title": "JavaScript Programming: Zero to Hero",
    "description": "Master JavaScript from absolute scratch...",
    "level": "Beginner",
    "duration_estimate": "80+ Hours",
    "icon": "JS",
    "outcomes": [
      "Build real interactive web applications",
      "Master Object-Oriented Programming"
    ],
    "prerequisites": []
  },
  "modules": [ ... ]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `slug` | string | ✅ | URL-safe, lowercase, hyphens. **Must be unique across all courses.** |
| `title` | string | ✅ | Full display title |
| `description` | string | ✅ | 1-2 sentence course description |
| `level` | string | ✅ | "Beginner", "Intermediate", or "Advanced" |
| `duration_estimate` | string | ❌ | e.g. "80+ Hours", "6 Weeks" |
| `icon` | string | ❌ | 2-3 character abbreviation (e.g. "JS", "GO", "PY") |
| `outcomes` | string[] | ❌ | What students will learn (shown on course page) |
| `prerequisites` | string[] | ❌ | Prior knowledge needed |

### Module Structure

```json
{
  "title": "Module 1: Welcome to Programming & JavaScript",
  "slug": "welcome-to-programming-and-javascript",
  "order": 1,
  "lessons": [ ... ]
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `title` | string | ✅ | Format: `"Module N: Descriptive Title"` |
| `slug` | string | ✅ | **Must be unique within the course.** Lowercase, hyphens only. |
| `order` | number | ✅ | **Must be sequential starting from 1** with no gaps. |
| `lessons` | array | ✅ | Array of lesson objects. |

### Lesson Structure

```json
{
  "title": "What is Programming, Really?",
  "slug": "what-is-programming",
  "order": 1,
  "time_estimate_min": 20,
  "objectives": [
    "Understand what programming is",
    "Write your first line of code"
  ],
  "content": {
    "sections": [ ... ],
    "assessment": {
      "questions": [ ... ],
      "pass_criteria": { "min_correct": 3 }
    }
  }
}
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `title` | string | ✅ | Clear, descriptive lesson title |
| `slug` | string | ✅ | **Must be unique within the module.** |
| `order` | number | ✅ | Sequential starting from 1, no gaps. |
| `time_estimate_min` | number | ✅ | Estimated time in minutes (15-45 typical). |
| `objectives` | string[] | ✅ | 3-5 learning objectives per lesson. |
| `content.sections` | array | ✅ | Array of content section objects. |
| `content.assessment` | object | ✅ | Assessment questions block. |

---

## Content Section Types

Each section has a `type` field and type-specific properties:

### `text` — Explanatory Content
```json
{
  "type": "text",
  "content": "# Heading\n\nMarkdown-formatted explanation text..."
}
```

### `code` — Code Examples
```json
{
  "type": "code",
  "language": "javascript",
  "title": "Your First Function",
  "code": "function greet(name) {\n  return 'Hello, ' + name;\n}",
  "explanation": "This function takes a name parameter and returns a greeting."
}
```

### `callout` — Important Notes, Tips, Warnings
```json
{
  "type": "callout",
  "style": "tip",
  "title": "Pro Tip",
  "content": "Always use `const` by default..."
}
```
Styles: `"tip"`, `"warning"`, `"info"`, `"danger"`

### `key_concept` — Key Term Definitions
```json
{
  "type": "key_concept",
  "term": "Variable",
  "definition": "A named container that stores a value in memory.",
  "icon": "📦"
}
```

### `comparison_table` — Side-by-side Comparisons
```json
{
  "type": "comparison_table",
  "title": "let vs const vs var",
  "headers": ["Feature", "let", "const", "var"],
  "rows": [
    ["Reassignable", "✅", "❌", "✅"],
    ["Block scoped", "✅", "✅", "❌"]
  ]
}
```

### `interactive_demo` — Try-It Code Exercises
```json
{
  "type": "interactive_demo",
  "title": "Try It: Create a Variable",
  "starter_code": "let name = 'Alice';\nconsole.log(name);",
  "expected_output": "Alice",
  "hint": "Use let to declare a variable"
}
```

### `ascii_diagram` — Text-Based Diagrams
```json
{
  "type": "ascii_diagram",
  "title": "Call Stack Visualization",
  "content": "┌──────────┐\n│ main()   │\n├──────────┤\n│ greet()  │\n└──────────┘"
}
```

### Other Types
- `step_list` — Numbered steps (`{ "type": "step_list", "title": "...", "steps": ["Step 1", "Step 2"] }`)
- `real_world_example` — Real-world analogies (`{ "type": "real_world_example", "title": "...", "content": "..." }`)
- `visual_aid` — Visual (text-based) aids (`{ "type": "visual_aid", "title": "...", "content": "..." }`)
- `memory_model` — Memory layout diagrams (`{ "type": "memory_model", "title": "...", "content": "..." }`)

---

## Assessment Question Types

Each lesson needs 3-5 assessment questions. Question types:

### `mcq` — Multiple Choice
```json
{
  "type": "mcq",
  "prompt": "What does `typeof null` return in JavaScript?",
  "choices": ["'null'", "'object'", "'undefined'", "'boolean'"],
  "answer": "'object'",
  "explanation": "This is a historic bug in JavaScript..."
}
```

### `code` — Write Code
```json
{
  "type": "code",
  "prompt": "Write a function that adds two numbers.",
  "starter_code": "function add(a, b) {\n  // Your code\n}",
  "test_cases": ["add(1, 2) should return 3", "add(-1, 1) should return 0"],
  "hint": "Use the + operator"
}
```

### `predict` — Predict the Output
```json
{
  "type": "predict",
  "prompt": "```javascript\nconsole.log(typeof []);\n```",
  "answer": "object",
  "explanation": "Arrays are objects in JavaScript..."
}
```

---

## Critical Rules (Failure to Follow = Broken Course)

> [!CAUTION]
> These rules are NON-NEGOTIABLE. Violating any of them will cause data loss, duplicate entries, or broken UI.

### Slugs
- ❌ **NEVER** reuse a module slug within the same course
- ❌ **NEVER** reuse a lesson slug within the same module
- ✅ Slugs must be lowercase, use hyphens only (`a-z`, `0-9`, `-`)
- ✅ Course slugs must be globally unique across ALL courses

### Ordering
- ✅ Module `order` values must start at **1** and increment by **1** (no gaps: 1, 2, 3...)
- ✅ Lesson `order` values must start at **1** within each module (no gaps)
- ❌ **NEVER** have two modules/lessons with the same `order` value

### Module Title Convention
- The UI prepends `"Module N:"` automatically on the syllabus page
- If the module title already contains `"Module N:"`, the `stripModulePrefix()` helper in `[courseId]/page.tsx` removes it to prevent duplication
- **Recommended**: Include `"Module N:"` in the title in the JSON for clarity, e.g. `"Module 1: Welcome to Go"`

### Content Quality
- Every lesson needs at least **3 content sections**
- Every lesson needs **3-5 assessment questions**
- Every lesson needs **3-5 learning objectives**
- Time estimates should be **15-45 minutes** per lesson
- Each module should have **4-10 lessons**
- Include a variety of section types (don't have all text — mix in code, callouts, demos)

---

## Database Tables

The seed script populates these Supabase tables:

```
courses (id, slug, title, description, is_active, icon, level, ...)
   └── modules (id, course_id, slug, title, order_index)
         └── lessons (id, module_id, slug, title, order_index, time_estimate_min, objectives, next_lesson_slug)
               └── lesson_content (id, lesson_id, explanations, assessment_questions, code_demos, visual_aids)
```

**Conflict resolution (upsert):**
- Courses: conflict on `slug`
- Modules: conflict on `course_id + slug`
- Lessons: conflict on `module_id + slug`
- Content: conflict on `lesson_id`

This means re-running the seed script **updates** existing data rather than creating duplicates.

---

## Verification Checklist

Before considering a course "done", ensure:

- [ ] JSON file is valid (`JSON.parse` succeeds)
- [ ] Module orders are contiguous (1, 2, 3... no gaps)
- [ ] Lesson orders within each module are contiguous
- [ ] All slugs are unique (no duplicate module slugs, no duplicate lesson slugs per module)
- [ ] Every lesson has `content.sections` (at least 3 sections)
- [ ] Every lesson has `content.assessment.questions` (at least 3 questions)
- [ ] `npx tsx scripts/seed-course-json.ts` completes without errors
- [ ] `npx tsx scripts/audit-db.ts` shows **0 issues**
- [ ] The course appears on the `/courses` page
- [ ] Clicking into the course shows all modules and lessons
- [ ] Clicking a lesson renders content correctly

---

## Example: Minimal Valid Course

```json
{
  "course": {
    "slug": "python-basics",
    "title": "Python Programming: Getting Started",
    "description": "Learn Python from scratch.",
    "level": "Beginner",
    "duration_estimate": "20+ Hours",
    "icon": "PY",
    "outcomes": ["Write Python scripts", "Understand data types"],
    "prerequisites": []
  },
  "modules": [
    {
      "title": "Module 1: Hello Python",
      "slug": "hello-python",
      "order": 1,
      "lessons": [
        {
          "title": "Your First Python Script",
          "slug": "first-python-script",
          "order": 1,
          "time_estimate_min": 20,
          "objectives": [
            "Install Python",
            "Run a Python script",
            "Use the print() function"
          ],
          "content": {
            "sections": [
              {
                "type": "text",
                "content": "# Your First Python Script\n\nPython is one of the most popular..."
              },
              {
                "type": "code",
                "language": "python",
                "title": "Hello World",
                "code": "print('Hello, World!')",
                "explanation": "The print() function outputs text to the console."
              },
              {
                "type": "interactive_demo",
                "title": "Try It",
                "starter_code": "print('Your name here')",
                "expected_output": "Your name here",
                "hint": "Replace the text inside quotes"
              }
            ],
            "assessment": {
              "questions": [
                {
                  "type": "mcq",
                  "prompt": "What function prints output in Python?",
                  "choices": ["echo()", "print()", "log()", "write()"],
                  "answer": "print()",
                  "explanation": "Python uses print() to output to the console."
                },
                {
                  "type": "predict",
                  "prompt": "```python\nprint(2 + 3)\n```",
                  "answer": "5",
                  "explanation": "Python evaluates 2 + 3 = 5 and prints it."
                },
                {
                  "type": "code",
                  "prompt": "Write code to print 'Hello, Python!'",
                  "starter_code": "# Your code here",
                  "test_cases": ["output should be 'Hello, Python!'"],
                  "hint": "Use the print() function"
                }
              ],
              "pass_criteria": { "min_correct": 2 }
            }
          }
        }
      ]
    }
  ]
}
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Module missing from syllabus | Duplicate slug with another module | Ensure all module slugs are unique |
| "Module 1: Module 1: ..." | Title has prefix + UI adds prefix | This is auto-handled by `stripModulePrefix()` |
| Seed script fails | Invalid JSON | Run `JSON.parse` check first |
| Audit shows gaps | Skipped an order number | Ensure consecutive 1, 2, 3... |
| Lessons not rendering | Missing `content.sections` | Every lesson must have sections array |
| Old content still showing | Slug changed but old record not deleted | Delete old DB record manually, then re-seed |
