<script lang='ts'>
  import '../../../output.css';
  import type { PageData } from './$types';
  import DateP from '$lib/datep.svelte';

  export let data: PageData;
</script>

<svelte:head>
  <meta name="description" content={data.preview} />
  <title>{`${data.title} - Byron Sharman's blog`}</title>
</svelte:head>

<div class="flex justify-center p-4">
  <main class="max-w-prose">
    <article class="my-6 prose lg:prose-lg prose-img:mb-0 prose-img:w-max prose-img:object-scale-down sm:prose-img:max-h-96 md:prose-img:max-h-[34rem] prose-h1:mb-0 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none">
      <header class="mb-8 lg:mb-12">
        <h1>{data.title}</h1>
        <DateP unixtime={data.date} />
      </header>
      {@html data.html}
      <a href="/" class="text-sm underline">Back to home</a>
    </article>
  </main>
</div>
