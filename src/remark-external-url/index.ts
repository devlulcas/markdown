import { h } from "hastscript";
import type * as mdast from "mdast";
import type * as unified from "unified";
import { CONTINUE, visit } from "unist-util-visit";

type RemarkExternalUrlOptions = {
	domain: string;
};

interface LinkData extends mdast.LinkData {
	hName?: string;
	hProperties?: Record<string, unknown>;
}

type RemarkExternalUrl = unified.Plugin<[RemarkExternalUrlOptions], mdast.Root>;
export const remarkExternalUrl: RemarkExternalUrl = ({ domain }) => {
	if (!domain) {
		throw new Error("remark-external-url: domain is required");
	}

	return (tree, file) => {
		visit(tree, (node) => {
			if (node.type !== "link") {
				return CONTINUE;
			}

			if (node.url.startsWith("/")) {
				return CONTINUE;
			}

			if (!URL.canParse(node.url)) {
				file.fail("remark-external-url: invalid URL", node);
				return CONTINUE;
			}

			const url = new URL(node.url);
			const hostname = url.hostname;
			const isSameDomain = hostname === domain;

			if (isSameDomain) {
				return CONTINUE;
			}

			url.searchParams.set("utm_source", domain);
			url.searchParams.set("utm_medium", "link");
			url.searchParams.set("utm_campaign", "external");

			node.data ??= {};
			const data: LinkData = node.data;

			const anchorNode = h("a", {
				href: url.toString(),
				target: "_blank",
				rel: "noopener noreferrer",
			});

			data.hName = anchorNode.tagName;
			data.hProperties = anchorNode.properties;
		});
	};
};
