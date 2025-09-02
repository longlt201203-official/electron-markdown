# Markdown Writing Guide

Concise reference + best practices for writing clean, portable Markdown. Examples use **GitHub Flavored Markdown (GFM)** which most modern renderers (including this app) support.

---

## 1. Document Structure

Start every long document with an H1 and use descending order without skipping levels.
```md
# Title (H1)
## Major Section (H2)
### Subsection (H3)
#### Detail (H4)
```
Avoid using more than 4 heading levels—consider reorganizing instead.

## 2. Emphasis & Inline Elements
```md
*italic*  _italic_
**bold**  __bold__
***bold italic***
`inline code`
~~strikethrough~~
==highlight (not standard; may not render)==
```
Prefer backticks around code identifiers (`Array.prototype.map`).

## 3. Paragraphs & Line Breaks
Blank line separates paragraphs. End a line with two spaces for a hard break:
```md
First line.  ← two spaces
Second line (same paragraph visually).
```
Use hard breaks sparingly; lists and headings already provide spacing.

## 4. Lists
### Unordered
```md
- Item A
  - Nested item
    - Third level
* Asterisk also works
```
### Ordered
```md
1. Step one
2. Step two
3. Step three
```
You can number all items as `1.`; the renderer will auto-number:
```md
1. Alpha
1. Beta
1. Gamma
```
### Task Lists (GFM)
```md
- [ ] Incomplete task
- [x] Finished task
```

## 5. Blockquotes
```md
> A single-line quote.
>
> Multi‑paragraph quote: add a `>` blank line.
>> Nested quote level 2.
```
Great for citing sources or highlighting notes—not for layout.

## 6. Code
### Inline
Use single backticks; escape backticks inside with surrounding triple backticks or use double backticks inline: ``Here is `code` inside``.

### Fenced Blocks
````md
```js
function greet(name) {
  console.log(`Hello ${name}`)
}
```
````
Specify the language for syntax highlighting: `js`, `ts`, `bash`, `json`, `md`, etc.

### Indented (Legacy)
Avoid 4‑space indented blocks unless compatibility requires it.

## 7. Links & Images
```md
[Inline Link](https://example.com)
[Relative Link](./README.md)
![Alt text](https://placehold.co/300x150 "Optional Title")
```
Use meaningful link text (avoid “click here”). Provide descriptive alt text; leave empty `![]()` only for decorative images.

### Reference Style
```md
See the [spec][md-spec].

[md-spec]: https://spec.commonmark.org/
```
Helps keep paragraphs readable when link URLs are long.

## 8. Tables (GFM)
```md
| Feature | Supported | Notes |
|---------|:--------:|-------|
| Tables  | ✅        | GFM only |
| Footnotes | ✅     | GFM |
| Math    | ❌        | Use inline code or images |
```
Align with colons: `:---` (left), `:---:` (center), `---:` (right).

## 9. Footnotes (GFM)
```md
Here is a statement with a footnote.[^1]

[^1]: Footnote text supporting the statement.
```

## 10. Horizontal Rule
```md
---
***
___
```
Use only one style consistently per document.

## 11. Escaping Characters
Escape characters that would otherwise start Markdown constructs:
```md
\*literal asterisks\*
\# Not a heading
```

## 12. Inline HTML
Allowed by many renderers but reduces portability. Prefer pure Markdown.
```md
<details>
<summary>Click to expand</summary>
Hidden content
</details>
```

## 13. Front Matter (Optional)
Some systems parse YAML front matter.
```md
---
title: Example Doc
tags: [guide, markdown]
date: 2025-09-02
---
```
If your pipeline doesn't support it, it will just appear as text.

## 14. Admonitions / Callouts
Not part of core Markdown; mimic with blockquotes:
```md
> **Note:** This is an informational callout.
> **Warning:** Be careful!
```

## 15. Best Practices
- Keep lines ≤ 120 chars for diff readability (soft wrap).
- One blank line before/after block elements (tables, lists, code blocks).
- Use sentence case or consistent capitalization in headings.
- Avoid trailing whitespace except for deliberate line breaks.
- Prefer fenced code over indented blocks.
- Use UTF‑8 characters (✓, —) sparingly; ensure consumer environment supports them.

## 16. Common Pitfalls
| Problem | Cause | Fix |
|---------|-------|-----|
| Heading not rendering | Missing space after `#` | Use `# Heading` |
| List numbers restart unexpectedly | Blank line inside list | Remove blank line or indent correctly |
| Code block not highlighted | Missing language fence | Add ` ```lang` |
| Table misaligned | Missing pipes / uneven row cells | Ensure each row has same number of `|` |
| Literal asterisks become bullets | No escape | Prefix with backslash `\*` |

## 17. Extended GFM Features
- Strikethrough: `~~text~~`
- Autolink URLs: `https://example.com`
- Task lists: `- [ ]` / `- [x]`
- Footnotes: `[^id]`
- Tables

## 18. Performance Tips
Large documents: split into sections & link them; keep image sizes reasonable; prefer SVG for simple diagrams.

## 19. Accessibility
- Use heading levels sequentially.
- Provide descriptive alt text.
- Avoid conveying meaning only with color or bold.
- Use lists for actual lists (not manual bullet characters).

## 20. Minimal Cheat Sheet
```md
# H1
## H2
**bold** *italic* `code`
> quote
- list
1. ordered
---
`inline`
```js
console.log('block')
```
|A|B|
|--|--|
```

---

Happy writing! ✨


