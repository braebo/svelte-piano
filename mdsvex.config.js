//? https://mdsvex.com/docs#options

import autolinkHeadings from 'rehype-autolink-headings' //? https://github.com/rehypejs/rehype-autolink-headings
import slug from 'rehype-slug' //? https://github.com/rehypejs/rehype-slug
import abbr from 'remark-abbr' //? https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-abbr

const mdsvexConfig = {
	extensions: ['.md', '.svx'],
	smartypants: {
		dashes: 'oldschool',
	},
	remarkPlugins: [abbr],
	rehypePlugins: [
		slug,
		[
			autolinkHeadings,
			{
				behavior: 'wrap',
			},
		],
	],
}

export default mdsvexConfig
