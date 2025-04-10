# Documentation Writing Style Guide

This document outlines the writing style conventions used in the lomi. documentation. Consistency in style helps create a clear and professional experience for readers.

OUR COMPANY NAME IS WRITTEN : "lomi." with a dot '.' at the end and in low caps.

OUR API IS WRITTEN : "LOMI_API_KEY".

## **Headings**

-   **Level 1 (H1):** Use `# **Title**`. Always bold and use sentence case (capitalize only the first word and proper nouns). Example: `# **What is lomi.?**`
-   **Level 2 (H2):** Use `## **Title**`. Always bold and use sentence case. Example: `## **Payment complexity**`
-   **Level 3 (H3):** Use `### **Title**`. Always bold and use sentence case. Example: `### **Share your experience**`
-   **Level 4 (H4) and below:** Use standard markdown (`#### Title`, etc.) with sentence case. Bold is optional but generally used for emphasis within the text rather than for lower-level headings.

## **Emphasis**

-   Use **bold (`**text**`)** for:
    -   Highlighting key terms or concepts on first use.
    -   Drawing attention to important phrases or actions (e.g., "**Build, test & deploy**").
    -   Headings (as described above).
-   Use *italics (`*text*` or `_text_`)** sparingly, primarily for subtle emphasis or titles of works if needed (though generally not used in the current docs).
-   Use ***bold italics (`***text***`)*** very sparingly for extreme emphasis.

## **Lists**

-   Use hyphens (`-`) for unordered lists.
-   Use numbers (`1.`, `2.`) for ordered lists, especially for steps.
-   Maintain consistent sentence structure within list items where possible.

## **Code and Technical Terms**

-   Use backticks (`` `code` ``) for inline code, filenames (`what-is-lomi.mdx`), component names (`InfoBox`), API names, commands, and technical terms.
-   Use triple backticks (```) with a language identifier (e.g., ```tsx`) for code blocks.

## **Tone and Voice**

-   **Professional yet approachable:** Aim for clarity and accuracy.
-   **Merchant-focused:** Speak directly to the user (merchants, developers). Use "you" and "your".
-   **Action-oriented:** Use strong verbs, especially in headings related to actions (e.g., "Build with us").
-   **Concise:** Avoid jargon where possible and explain technical terms clearly.

## **Specific Components and Formatting**

-   **`InfoBox` Component:**
    -   Use the `<InfoBox>` component (imported from `src/components/ui/info-box.tsx`) for highlighting important notes, tips, or warnings.
    -   Syntax:
        ```mdx
        import InfoBox from '@/components/ui/info-box';

        <InfoBox title="Optional Title" variant="blue|green|red|yellow" type="info|tip">
          Your content here. Links can be included normally.
        </InfoBox>
        ```
    -   The `title` defaults to "Important".
    -   `variant` controls the color scheme.
    -   `type="tip"` uses a different icon (Rabbit instead of Info).
    -   See `src/pages/docs/introduction/what-is-lomi.mdx` for an example of blockquote usage (`> ***Get started...***`), which can sometimes serve a similar purpose to `InfoBox` for callouts. Decide based on visual preference and content.
-   **Links:** Use standard markdown links `[Link text](URL)`. Ensure link text is descriptive. For internal links, use relative paths (e.g., `/docs/freedom/codebase`).
-   **Emojis:** Use emojis sparingly to add personality, often at the end of headings (e.g., `## **Why use Jumbo?** 🚀`).

## **General Conventions**

-   **Abbreviations:** Define abbreviations on first use if they are not common knowledge (e.g., "Banque Centrale des États de l'Afrique de l'Ouest (BCEAO)").
-   **Contractions:** Use contractions (like "don't", "it's", "you're") where appropriate to maintain a conversational tone, but avoid overuse.
-   **Grammar and Spelling:** Proofread carefully. Use consistent spelling (e.g., US English).

By adhering to these guidelines, we can maintain a consistent, readable, and professional documentation site. 