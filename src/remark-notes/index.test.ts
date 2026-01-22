import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { read } from "to-vfile";
import { unified } from "unified";
import { expect, test } from "vitest";

import { remarkNotes } from "./index.js";

function clean(html: string) {
	return html.replace(/\s+/gi, " ").trim();
}

test("create blockquote tags from :::note{.class}::: directives", async () => {
	const markdown = await read("src/remark-notes/fixtures/notes.md");
	const target = await read("src/remark-notes/fixtures/notes.html");

	const file = await unified()
		.use(remarkParse)
		.use(remarkDirective)
		.use(remarkNotes, { validClasses: ["warning"] })
		.use(remarkRehype)
		.use(rehypeFormat)
		.use(rehypeStringify)
		.process(markdown);

	expect(clean(file.toString())).toBe(clean(target.toString()));
});
