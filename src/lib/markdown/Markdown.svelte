<script lang="ts">
	import 'katex/dist/katex.min.css';
	import 'katex/dist/contrib/mhchem.js';
	import 'highlight.js/styles/xcode.css';
	import './custom.css';

	import rehypeHighlight from 'rehype-highlight';
	import rehypeKatex from 'rehype-katex';
	import rehypeSanitize from 'rehype-sanitize';
	import remarkGfm from 'remark-gfm';
	import remarkMath from 'remark-math';
	import { Markdown,type Plugin } from 'svelte-exmarkdown';
	const CLIPBOARD_SVG =
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
	const CHECK_SVG =
		'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>';

	interface Props {
		md: string;
		elem_id?: string;
	}

	let { md, elem_id = '' }: Props = $props();

	let codeBlocks = $derived.by(() => {
		const matches = md.matchAll(/```(\w+)\n([\s\S]*?)```/g);
		return Array.from(matches).map((match) => match[2]);
	});

	let citationBlocks = $derived.by(() => {
		const matches = md.matchAll(/```([^\n:]+:[^\n]+)\n([\s\S]*?)```/g);
		return Array.from(matches).map((match) => ({
			citation: match[1],
			content: match[2]
		}));
	});

	$effect(() => {
		if (elem_id !== '') {
			const hljsElems = Array.from(document.querySelectorAll(`#${elem_id} .hljs`)).filter(
				(el) => el instanceof HTMLElement
			);

			// Process regular code blocks
			let codeBlockIndex = 0;
			let citationBlockIndex = 0;

			for (let i = 0; i < hljsElems.length; i++) {
				const elem = hljsElems[i];
				const parent = elem.parentElement;

				// Check if this is a citation block by looking for citation format in the previous element
				const prevElem = parent?.previousElementSibling;
				const isCitationBlock = prevElem && prevElem.textContent?.includes(':');

				if (isCitationBlock && citationBlockIndex < citationBlocks.length) {
					// Handle citation block
					const citationData = citationBlocks[citationBlockIndex];
					const [fileId, title] = citationData.citation.split(':').map((part) => part.trim());

					// Create topbar as a single link
					const topbar = document.createElement('div');
					topbar.style.backgroundColor = '#f0f0f0';
					topbar.style.padding = '8px 12px';
					topbar.style.borderTopLeftRadius = '4px';
					topbar.style.borderTopRightRadius = '4px';
					topbar.style.borderBottom = '1px solid #ddd';
					topbar.style.marginBottom = '0';

					// Create file link that spans the whole topbar
					const fileLink = document.createElement('a');
					fileLink.href = `/dashboard/file/${fileId}`;
					fileLink.textContent = title || fileId;
					fileLink.style.textDecoration = 'none';
					fileLink.style.color = '#0366d6';
					fileLink.style.fontWeight = 'bold';
					fileLink.style.display = 'block';
					fileLink.style.width = '100%';

					// Add link to topbar
					topbar.appendChild(fileLink);

					// Adjust styles to eliminate gap
					elem.style.marginTop = '0';
					elem.style.borderTopLeftRadius = '0';
					elem.style.borderTopRightRadius = '0';

					// Create wrapper div to contain both topbar and code block without gaps
					const wrapper = document.createElement('div');
					wrapper.style.position = 'relative';
					wrapper.style.borderRadius = '4px';
					wrapper.style.overflow = 'hidden';
					wrapper.style.marginBottom = '16px';
					wrapper.style.display = 'flex';
					wrapper.style.flexDirection = 'column';

					// Replace the code block with our wrapper
					parent.insertBefore(wrapper, elem);
					wrapper.appendChild(topbar);
					wrapper.appendChild(elem);

					citationBlockIndex++;
				} else if (codeBlockIndex < codeBlocks.length) {
					// Handle regular code block
					const appendedButton = document.createElement('button');
					elem.style.position = 'relative';
					appendedButton.style.position = 'absolute';
					appendedButton.style.top = '15px';
					appendedButton.style.right = '15px';
					appendedButton.innerHTML = CLIPBOARD_SVG;
					appendedButton.addEventListener('click', async () => {
						await navigator.clipboard.writeText(codeBlocks[codeBlockIndex].trim());
						appendedButton.innerHTML = CHECK_SVG;
						setTimeout(() => {
							appendedButton.innerHTML = CLIPBOARD_SVG;
						}, 1000);
					});

					elem.prepend(appendedButton);
					codeBlockIndex++;
				}
			}
		}
	});

	const plugins: Plugin[] = [
		{ remarkPlugin: [remarkGfm] },
		{ rehypePlugin: [rehypeSanitize] },
		{ rehypePlugin: [rehypeKatex], remarkPlugin: [remarkMath] },
		{ rehypePlugin: [rehypeHighlight] }
		/* Potentially dangerous elements to use instead of rehypeSanitize if needed. */
		// denylist(['img', 'script', 'a', 'iframe', 'style', 'object', 'video', 'audio', 'embed', 'form', 'input', 'meta', 'svg', 'details', 'summary', 'base'])
	];

	let harmonizedMarkdown = $derived(
		md.replace(/\\(\[|\])|\\\(|\\\)/g, (match: string) => {
			if (match === '\\[' || match === '\\]') return '$$';
			if (match === '\\(' || match === '\\)') return '$';
			return match;
		})
	);
</script>

<div id={elem_id} class="markdown-container">
	<Markdown md={harmonizedMarkdown} {plugins} />
</div>

<style>
	.markdown-container :global(pre) {
		white-space: pre-wrap;
		word-wrap: break-word;
		overflow-x: auto;
	}

	.markdown-container :global(table) {
		display: block;
		max-width: 100%;
		overflow-x: auto;
		border-collapse: collapse;
	}

	.markdown-container :global(th),
	.markdown-container :global(td) {
		padding: 0.5em;
		border: 1px solid #ccc;
	}

	.markdown-container {
		overflow-wrap: break-word;
	}
</style>
