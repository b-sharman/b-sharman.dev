<script lang='ts'>
  import type { Blog } from '$lib/types';
  import DateP from '$lib/datep.svelte';

  export let blog: Blog;
</script>

<li class="border hover:border-gray-400 rounded-xl">
  <a href={`/blog/${blog.slug}`} class="flex flex-col size-full p-4 rounded-lg">
    <h3 class="font-bold text-xl mb-4 text-pretty">{blog.title}</h3>
    <p class="grow line-clamp-3">{blog.preview}</p>
    <DateP unixtime={blog.date} />
  </a>
</li>
