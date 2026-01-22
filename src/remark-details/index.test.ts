import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { read } from "to-vfile";
import { unified } from "unified";
import { expect, test } from "vitest";

import { remarkDetails } from "./index.js";

function clean(html: string) {
	return html.replace(/\s+/gi, " ").trim();
}

test("create details tags from :::details[summary]{open}::: directives", async () => {
	const markdown = await read("src/remark-details/fixtures/details.md");
	const target = await read("src/remark-details/fixtures/details.html");

	const file = await unified()
		.use(remarkParse)
		.use(remarkDirective)
		.use(remarkDetails)
		.use(remarkRehype)
		.use(rehypeFormat)
		.use(rehypeStringify)
		.process(markdown);

	expect(clean(file.toString())).toBe(clean(target.toString()));
});
