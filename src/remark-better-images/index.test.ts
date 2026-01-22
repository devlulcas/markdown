import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { expect, test } from "vitest";
import { remarkBetterImages } from "./index.js";

test("should add lazy in images by default", async () => {
	const markdown = "![image](/image.png)";

	const file = unified()
		.use(remarkParse)
		.use(remarkBetterImages, { baseUrl: "https://example.com", lazyload: true })
		.use(remarkRehype)
		.use(rehypeFormat)
		.use(rehypeStringify);

	const result = await file.process(markdown);

	expect(result.toString()).toContain('loading="lazy"');
});
