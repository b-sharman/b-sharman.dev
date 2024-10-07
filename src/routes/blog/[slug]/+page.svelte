<script lang='ts'>
  import 'highlight.js/styles/base16/papercolor-light.css';

  import type { PageData } from './$types';
  import DateP from '$lib/datep.svelte';
  import BlogCard from '$lib/blog_card.svelte';

  export let data: PageData;
</script>

<svelte:head>
  <title>{`${data.title} - Byron Sharman's blog`}</title>
  <meta name="description" content={data.preview} />

  <meta property="og:title" content={data.title} />
  <meta property="og:type" content="article" />
  <meta property="og:url" content={data.url} />
  {#if data.previewImage}
    <meta property="og:image" content={data.openGraphImageUrl} />
    <meta property="og:image:secure_url" content={data.openGraphImageUrl} />
    <meta property="og:image:alt" content={data.previewImageAlt} />
  {/if}
  <meta property="og:description" content={data.preview} />
  <meta property="og:site_name" content="Byron Sharman's blog" />

  {@html `<script type="application/ld+json">${data.ldjson}</script>`}
</svelte:head>

<div class="flex justify-center p-4">
  <main class="size-full max-w-[1240px] min-w-0 flex flex-col items-center">
    <article class="w-full my-6 prose text-[17px]">
      <header class="mb-8 lg:mb-12">
        <h1 class="text-pretty">{data.title}</h1>
        <DateP unixtime={data.date} />
        {#if data.customHeaderHTML}
          {@html data.customHeaderHTML}
        {/if}
      </header>
      {@html data.html}
    </article>

    <hr class="size-full border-gray-300 my-10"/>

    <h2 class="w-full heading2">Recent Posts</h2>
      <ul class="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-4">
        {#each Object.values(data.blogs) as blog}
          <BlogCard blog={blog} />
        {/each}
      </ul>

    <footer class="flex flex-row justify-center mt-8 mb-2">
      <a href="/" class="text-sm underline">Back to home</a>
    </footer>

  </main>
</div>
