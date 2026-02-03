import { h } from "hastscript";
import type * as mdast from "mdast";
import type { } from "mdast-util-directive";
import type * as unified from "unified";
import { CONTINUE, visit } from "unist-util-visit";
import type { VFile } from "vfile";
import type { HastData } from "../@types/hast.js";

type RemarkDetails = unified.Plugin<[], mdast.Root>;
export const remarkDetails: RemarkDetails = () => {
	return (tree: mdast.Root, file: VFile) => {
		visit(tree, (node) => {
			// Creates a summary tag from a paragraph with a directive label
			if (
				node.type === "paragraph" &&
				node.data &&
				"directiveLabel" in node.data &&
				node.data.directiveLabel === true
			) {
				const [first] = node.children.slice(0, 1);

				if (!first || first.type !== "text") {
					return file.fail(
						"details: summary must have a text node as first child",
						node,
					);
				}

				const summaryNode = h("summary", first.value);
				const data = node.data as HastData;

				data.hName = summaryNode.tagName;
				data.hProperties = summaryNode.properties;
			}

			if (node.type === "containerDirective" && node.name === "details") {
				const data = (node.data ?? {}) as HastData;
				const attributes = node.attributes || {};
				const open = "open" in attributes ? attributes.open : false;

				const firstChild = node.children?.slice(0, 1)[0];

				if (!firstChild) {
					return file.fail("details: at least one child is required", node);
				}

				const detailsNode = h("details", { open });

				data.hName = detailsNode.tagName;
				data.hProperties = detailsNode.properties;
			}

			return CONTINUE;
		});
	};
};
