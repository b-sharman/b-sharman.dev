<script lang='ts'>
  import DateP from '$lib/datep.svelte';

  export let blog;
</script>

<li class="border hover:border-gray-400 rounded-xl my-4">
  <a href={`/blog/${blog.slug}`} class="block p-4 rounded-lg">
    <h3 class="font-bold text-xl mb-4">{blog.title}</h3>
    <p class="line-clamp-3">{blog.preview}</p>
    <DateP unixtime={blog.date} />
  </a>
</li>
