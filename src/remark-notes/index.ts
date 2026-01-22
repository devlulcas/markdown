import { h } from "hastscript";
import type * as mdast from "mdast";
import type { } from "mdast-util-directive";
import type * as unified from "unified";
import { visit } from "unist-util-visit";
import type { VFile } from "vfile";

type RemarkNotesOptions = {
	validClasses?: string[];
};

const DEFAULT_VALID_CLASSES = ["info", "warning", "danger", "tip"];
type RemarkNotes = unified.Plugin<[options?: RemarkNotesOptions], mdast.Root>;
export const remarkNotes: RemarkNotes = (
	{ validClasses } = { validClasses: DEFAULT_VALID_CLASSES },
) => {
	return (tree: mdast.Root, file: VFile) => {
		visit(tree, (node) => {
			if (node.type === "containerDirective" && node.name === "note") {
				node.data ??= {};
				const data = node.data;
				const attributes = node.attributes || {};
				const className = attributes.class || "";

				if (!validClasses?.includes(className)) {
					return file.fail(`note: invalid class name: ${className}`, node);
				}

				const blockquoteNode = h("blockquote", { class: className });

				data.hName = blockquoteNode.tagName;
				data.hProperties = blockquoteNode.properties;
			}
		});
	};
};
