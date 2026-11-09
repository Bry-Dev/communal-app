<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import StatusBar from '$lib/components/StatusBar.svelte';
	import ToolHeader from '$lib/components/ToolHeader.svelte';
	import { receiveText } from '$lib/handoff';
	import { describeParseError, formatXml, locateXmlError, minifyXml, type XmlParseError } from '$lib/xml/format';

	type TreeNode = {
		name: string;
		attributes: Array<[string, string]>;
		text: string;
		children: TreeNode[];
	};

	type Analysis =
		| { status: 'empty' }
		| { status: 'invalid'; error: XmlParseError }
		| { status: 'valid'; root: TreeNode; elements: number; attributes: number; depth: number; truncated: boolean };

	const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<library>
  <book id="b1" available="true">
    <title>The Pragmatic Programmer</title>
    <author>Andrew Hunt</author>
    <year>1999</year>
  </book>
  <book id="b2" available="false">
    <title>Clean Code</title>
    <author>Robert C. Martin</author>
    <year>2008</year>
  </book>
</library>`;

	const LINE_HEIGHT = 24;
	const MAX_TREE_NODES = 2000;

	const indentOptions = [
		{ label: '2 spaces', value: '  ' },
		{ label: '4 spaces', value: '    ' },
		{ label: 'Tab', value: '\t' }
	];

	let xml = $state(SAMPLE);
	let fileName = $state('document.xml');
	let indent = $state('  ');
	let copied = $state(false);
	let textarea: HTMLTextAreaElement | undefined = $state();
	let gutter: HTMLDivElement | undefined = $state();
	let backdrop: HTMLDivElement | undefined = $state();
	let fileInput: HTMLInputElement | undefined = $state();

	function toTree(element: Element, budget: { left: number }, depth: number, stats: { elements: number; attributes: number; depth: number }): TreeNode {
		stats.elements++;
		stats.attributes += element.attributes.length;
		stats.depth = Math.max(stats.depth, depth);
		budget.left--;

		const children: TreeNode[] = [];
		let text = '';
		for (const child of Array.from(element.childNodes)) {
			if (child.nodeType === Node.ELEMENT_NODE) {
				if (budget.left > 0) children.push(toTree(child as Element, budget, depth + 1, stats));
				else countOnly(child as Element, depth + 1, stats);
			} else if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE) {
				text += child.nodeValue ?? '';
			}
		}

		return {
			name: element.nodeName,
			attributes: Array.from(element.attributes, (attr) => [attr.name, attr.value] as [string, string]),
			text: text.replace(/\s+/g, ' ').trim(),
			children
		};
	}

	function countOnly(element: Element, depth: number, stats: { elements: number; attributes: number; depth: number }) {
		stats.elements++;
		stats.attributes += element.attributes.length;
		stats.depth = Math.max(stats.depth, depth);
		for (const child of Array.from(element.children)) countOnly(child, depth + 1, stats);
	}

	function analyze(source: string): Analysis {
		if (!source.trim()) return { status: 'empty' };
		if (!browser) return { status: 'empty' };

		const doc = new DOMParser().parseFromString(source, 'application/xml');
		const parserError = doc.getElementsByTagName('parsererror')[0];
		if (parserError || !doc.documentElement) {
			return { status: 'invalid', error: describeParseError(parserError?.textContent ?? '') };
		}

		const stats = { elements: 0, attributes: 0, depth: 0 };
		const budget = { left: MAX_TREE_NODES };
		const root = toTree(doc.documentElement, budget, 1, stats);
		return { status: 'valid', root, ...stats, truncated: budget.left <= 0 && stats.elements > MAX_TREE_NODES };
	}

	const analysis = $derived(analyze(xml));
	const lineCount = $derived(xml.split('\n').length);
	const errorLocation = $derived(analysis.status === 'invalid' ? locateXmlError(xml, analysis.error) : undefined);
	const errorLine = $derived(errorLocation?.line);

	function syncScroll() {
		if (!textarea) return;
		if (gutter) gutter.scrollTop = textarea.scrollTop;
		if (backdrop) backdrop.style.transform = `translate(${-textarea.scrollLeft}px, ${-textarea.scrollTop}px)`;
	}

	function goToError() {
		if (!textarea || !errorLocation) return;
		const { start, end, line } = errorLocation;
		textarea.focus();
		textarea.setSelectionRange(start, end);
		textarea.scrollTop = Math.max(0, (line - 1) * LINE_HEIGHT - textarea.clientHeight / 2);
		const lineStart = xml.lastIndexOf('\n', start - 1) + 1;
		const charWidth = parseFloat(getComputedStyle(textarea).fontSize) * 0.6;
		textarea.scrollLeft = Math.max(0, (start - lineStart) * charWidth - textarea.clientWidth / 2);
		syncScroll();
	}

	onMount(() => {
		const sent = receiveText('xml');
		if (sent !== undefined) {
			xml = sent;
			fileName = 'pasted.xml';
		}
	});

	function onWindowKeydown(event: KeyboardEvent) {
		if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
			event.preventDefault();
			format();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Tab' || !textarea) return;
		event.preventDefault();
		const { selectionStart, selectionEnd } = textarea;
		xml = xml.slice(0, selectionStart) + indent + xml.slice(selectionEnd);
		const caret = selectionStart + indent.length;
		requestAnimationFrame(() => textarea?.setSelectionRange(caret, caret));
	}

	function format() {
		if (analysis.status === 'valid') xml = formatXml(xml, indent);
	}

	function minify() {
		if (analysis.status === 'valid') xml = minifyXml(xml);
	}

	async function openFile(event: Event) {
		const file = (event.currentTarget as HTMLInputElement).files?.[0];
		if (!file) return;
		xml = await file.text();
		fileName = file.name;
		(event.currentTarget as HTMLInputElement).value = '';
	}

	function download() {
		const url = URL.createObjectURL(new Blob([xml], { type: 'application/xml' }));
		const link = document.createElement('a');
		link.href = url;
		link.download = fileName.toLowerCase().endsWith('.xml') ? fileName : `${fileName}.xml`;
		link.click();
		URL.revokeObjectURL(url);
	}

	async function copy() {
		await navigator.clipboard.writeText(xml);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	const toolButton = 'min-h-11 rounded-lg border border-line px-3 text-sm font-medium hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40';
</script>

<svelte:head>
	<title>XML Editor | App Hub</title>
	<meta name="description" content="Edit, validate, format, and explore XML documents in your browser." />
</svelte:head>

{#snippet treeNode(node: TreeNode, open: boolean)}
	{#if node.children.length > 0}
		<details {open} class="pl-3">
			<summary class="cursor-pointer py-0.5">
				{@render tagLabel(node)}
				<span class="text-muted">({node.children.length})</span>
			</summary>
			<div class="border-l border-line">
				{#each node.children as child}
					{@render treeNode(child, false)}
				{/each}
			</div>
		</details>
	{:else}
		<div class="py-0.5 pl-6">{@render tagLabel(node)}</div>
	{/if}
{/snippet}

{#snippet tagLabel(node: TreeNode)}
	<span class="font-semibold text-accent">&lt;{node.name}&gt;</span>
	{#each node.attributes as [name, value]}
		<span class="ml-1"><span class="text-muted">{name}=</span>"{value}"</span>
	{/each}
	{#if node.text}
		<span class="ml-1 break-all">{node.text.length > 80 ? node.text.slice(0, 80) + '…' : node.text}</span>
	{/if}
{/snippet}

<svelte:window onkeydown={onWindowKeydown} />

<section class="tone-xml">
	<div class="page-width pt-8 sm:pt-10">
	<ToolHeader code="xml">
		{#snippet actions()}
			<button type="button" class="inline-flex min-h-10 items-center rounded-lg px-3 text-sm font-medium text-accent hover:bg-accent-soft" onclick={() => { xml = SAMPLE; fileName = 'document.xml'; }}>Try an example</button>
		{/snippet}
	</ToolHeader>

	<div class="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
		<div class="panel min-w-0 p-4 sm:p-5">
			<div class="mb-4 flex flex-wrap items-center gap-2">
				<button type="button" class={toolButton} onclick={() => fileInput?.click()}>Open file</button>
				<input bind:this={fileInput} type="file" accept=".xml,.svg,.xsd,.xsl,.xslt,.rss,.atom,.plist,.config,.csproj,text/xml,application/xml" class="hidden" onchange={openFile} />
				<button type="button" class="button min-h-11 px-3" onclick={format} disabled={analysis.status !== 'valid'}>Format <span class="kbd hidden border-transparent bg-transparent text-current opacity-75 shadow-none sm:inline-flex">Ctrl ↵</span></button>
				<button type="button" class={toolButton} onclick={minify} disabled={analysis.status !== 'valid'}>Minify</button>
				<label class="sr-only" for="indent">Indentation</label>
				<select id="indent" bind:value={indent} class="field min-h-11 w-auto py-2 text-sm">
					{#each indentOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
				<span class="flex-1"></span>
				<button type="button" class={toolButton} onclick={copy} disabled={!xml}>{copied ? 'Copied!' : 'Copy'}</button>
				<button type="button" class={toolButton} onclick={download} disabled={!xml}>Download</button>
				<button type="button" class="min-h-11 rounded-lg px-3 text-sm text-accent hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40" onclick={() => (xml = '')} disabled={!xml}>Clear</button>
			</div>

			<label for="xml-input" class="sr-only">XML source</label>
			<div class="flex h-[32rem] overflow-hidden rounded-lg border border-line font-mono text-sm focus-within:border-accent">
				<div bind:this={gutter} aria-hidden="true" class="select-none overflow-hidden bg-soft py-3 text-right text-muted" style="line-height: {LINE_HEIGHT}px">
					{#each { length: lineCount } as _, i}
						<div class="px-3 tabular-nums {errorLine === i + 1 ? 'bg-red-500/25 font-bold text-ink' : ''}">{i + 1}</div>
					{/each}
					<div style="height: {LINE_HEIGHT}px"></div>
				</div>
				<div class="relative min-w-0 flex-1 bg-surface">
					<div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
						<div bind:this={backdrop} class="whitespace-pre px-4 py-3 text-transparent" style="line-height: {LINE_HEIGHT}px; tab-size: 4">{#if errorLocation}{xml.slice(0, errorLocation.start)}<mark class="rounded-sm bg-red-500/25 text-transparent">{xml.slice(errorLocation.start, errorLocation.end)}</mark>{xml.slice(errorLocation.end)}{/if}&#32;</div>
					</div>
				<textarea
					id="xml-input"
					bind:this={textarea}
					bind:value={xml}
					onscroll={syncScroll}
					onkeydown={handleKeydown}
					wrap="off"
					spellcheck="false"
					autocomplete="off"
					class="relative block h-full w-full resize-none bg-transparent px-4 py-3 text-ink outline-none"
					style="line-height: {LINE_HEIGHT}px; tab-size: 4"
					placeholder="Paste XML here, or open a file..."
					aria-describedby="xml-status"
				></textarea>
				</div>
			</div>

			<div id="xml-status" class="mt-4 text-sm" aria-live="polite">
				{#if analysis.status === 'invalid'}
					<div class="flex flex-wrap items-center gap-3 rounded-lg border border-warning bg-warning-soft px-4 py-3 text-warning">
						<p class="flex-1">
							<span class="font-semibold">Not valid XML{errorLocation ? ` (line ${errorLocation.line}, column ${errorLocation.column})` : ''}:</span>
							{analysis.error.message}{#if errorLocation?.hint}{' '}<span class="font-medium">{errorLocation.hint}</span>{/if}
						</p>
						{#if errorLocation}
							<button type="button" class="min-h-11 rounded-lg px-3 font-medium underline" onclick={goToError}>Go to error</button>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<aside aria-label="Document structure" class="panel overflow-hidden">
			<div class="border-b border-line bg-accent-soft px-5 py-3">
				<label for="file-name" class="text-xs font-semibold uppercase tracking-wider text-accent">File</label>
				<input id="file-name" bind:value={fileName} class="num w-full bg-transparent font-semibold text-ink outline-none" />
			</div>
			<div class="max-h-[30rem] overflow-auto px-3 py-4 font-mono text-xs leading-5">
				{#if analysis.status === 'valid'}
					{@render treeNode(analysis.root, true)}
					{#if analysis.truncated}
						<p class="mt-3 px-3 font-sans text-muted">Tree shows the first {MAX_TREE_NODES.toLocaleString()} elements.</p>
					{/if}
				{:else if analysis.status === 'invalid'}
					<p class="px-3 font-sans text-muted">Fix the error to see the document tree.</p>
				{:else}
					<p class="px-3 font-sans text-muted">The tree appears here once you add XML.</p>
				{/if}
			</div>
		</aside>
	</div>
	</div>

	<StatusBar
		items={analysis.status === 'valid'
			? [
					{ label: '', value: '✓ Well-formed', strong: true },
					{ label: 'elements', value: analysis.elements },
					{ label: 'attributes', value: analysis.attributes },
					{ label: 'deep', value: analysis.depth },
					{ label: 'lines', value: lineCount }
				]
			: analysis.status === 'invalid'
				? [{ label: '', value: '✕ Not valid' }, { label: 'lines', value: lineCount }]
				: [{ label: 'Empty', value: '' }]}
	/>
</section>
