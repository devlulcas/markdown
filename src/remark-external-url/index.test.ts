import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import html from "remark-html";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { expect, test } from "vitest";
import { remarkExternalUrl } from "./index.js";

test("should add _blank in links that start with http", async () => {
	const markdown = "[website](https://something.com)";
	const markdownShort = "<https://something.com>";

	const file = unified()
		.use(remarkParse)
		.use(remarkExternalUrl, { domain: "example.com" })
		.use(remarkRehype)
		.use(rehypeFormat)
		.use(rehypeStringify);

	const result = await file.process(markdown);
	const resultShort = await file.process(markdownShort);

	expect(result.toString()).toContain('target="_blank"');
	expect(resultShort.toString()).toContain('target="_blank"');
});

test("should not add _blank in links if the website domain is the same as the in the domain option", async () => {
	const markdown = "[website](https://example.com)";
	const markdownShort = "<https://example.com>";

	const file = unified()
		.use(remarkParse)
		.use(remarkExternalUrl, { domain: "example.com" })
		.use(remarkRehype)
		.use(rehypeFormat)
		.use(rehypeStringify);

	const result = await file.process(markdown);
	const resultShort = await file.process(markdownShort);

	expect(result.toString()).not.toContain('target="_blank"');
	expect(resultShort.toString()).not.toContain('target="_blank"');
});

test("should ignore images", async () => {
	const markdown = "![alt](https://example.com/image)";

	const processor = remark()
		.use(remarkExternalUrl, { domain: "example.com" })
		.use(html, { sanitize: false });

	const result = await processor.process(markdown);

	expect(result.toString()).not.toContain('target="_blank"');
});

test("should ignore footnotes", async () => {
	const markdown = "[^1]";

	const file = unified()
		.use(remarkParse)
		.use(remarkExternalUrl, { domain: "example.com" })
		.use(remarkRehype)
		.use(rehypeFormat)
		.use(rehypeStringify);

	const result = await file.process(markdown);

	expect(result.toString()).not.toContain('target="_blank"');
});
