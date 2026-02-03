import type * as mdast from "mdast";
import type * as unified from "unified";
import { CONTINUE, visit } from "unist-util-visit";
import type { HastData } from "../@types/hast.js";

type RemarkBetterImagesOptions = {
	/**
	 * Adds a base url to relative images
	 */
	baseUrl: string;

	/**
	 * Adds loadind='lazy' to md images
	 */
	lazyload: boolean;
};

const DEFAULT_OPTIONS: Partial<RemarkBetterImagesOptions> = {
	lazyload: true,
};

type RemarkBetterImages = unified.Plugin<
	[RemarkBetterImagesOptions],
	mdast.Root
>;

export const remarkBetterImages: RemarkBetterImages = (pluginOptions) => {
	const options = {
		...DEFAULT_OPTIONS,
		...pluginOptions,
	};

	return (tree: mdast.Root) => {
		visit(tree, (node) => {
			if (node.type !== "image") return CONTINUE;
			node.url = new URL(node.url, options.baseUrl).toString();

			const data = (node.data ?? {}) as HastData;
			data.hProperties ??= {};
			const properties = data.hProperties;

			if (options.lazyload) {
				properties.loading = "lazy";
			}

			return CONTINUE;
		});
	};
};
