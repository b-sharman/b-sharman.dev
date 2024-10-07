<script lang='ts'>
  import type { PageData } from './$types';
  import { onMount } from 'svelte';
  import Email from '$lib/email.svelte';
  import BlogCard from '$lib/blog_card.svelte';
  import ProjectCard from '$lib/project_card.svelte';

  export let data: PageData;

  // whether the projects list is expanded to show all projects
  let projectsExpanded = false;

  let projectGrid: HTMLElement;

  const defaultNumProjects = 3;
  let numProjects = defaultNumProjects;
  const calcNumProjects = () => {
    const numCols = window
      .getComputedStyle(projectGrid)
      .getPropertyValue("grid-template-columns")
      .split(" ")
      .length;
    if (numCols == 2) numProjects = 2;
    else if (numCols > defaultNumProjects) numProjects = numCols;
    else numProjects = defaultNumProjects;
  };

  onMount(calcNumProjects);

  $: projectCount = projectsExpanded ? data.projects.length : numProjects;
  $: expandButtonText = projectsExpanded ? "collapse" : `show all (${data.projects.length - numProjects} more)`;
</script>

<svelte:window on:resize={calcNumProjects} />

<svelte:head>
  <title>Byron Sharman</title>
  <meta name="description" content="I'm Byron, a computer science student at Colorado School of Mines. I love to write code and learn new technologies. Here, you can browse some of my projects or read my blog posts." />
</svelte:head>

<div class="flex justify-center p-4">
  <main class="size-full max-w-[1240px]">

    <div class="flex flex-col items-center">
      <header class="my-6 max-w-prose">
        <img alt="portrait of my face with blurred plants in the background" src="portrait.avif" class="m-auto p-8 size-3/4 max-w-[320px] rounded-full" />
        <h1 class="font-bold text-4xl lg:text-5xl text-center">Byron Sharman</h1>
        <ul class="my-4 flex flex-row justify-center divide-x">
            <li class="px-4"><Email /></li>
            <li class="px-4"><a href="https://github.com/b-sharman">GitHub</a></li>
            <li class="px-4"><a href="https://www.linkedin.com/in/b-sharman/">LinkedIn</a></li>
        </ul>
      </header>

      <article class="my-6 prose md:prose-lg lg:prose-xl">
        <p class="text-pretty">
          I'm Byron, a computer science student at Colorado School of Mines. I love to go to hackathons, learn tools and technologies, and explore the world, both physically and conceptually.
        </p>
      </article>
    </div>

    <section class="my-6 md:my-10">
      <h2 class="heading2">Projects</h2>
      <ul bind:this={projectGrid} class="grid grid-flow-row grid-cols-1 sm:grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] gap-4">
        {#each data.projects.slice(0, projectCount) as project}
          <ProjectCard project={project} />
        {/each}
      </ul>
      <button
        on:click={() => {projectsExpanded = !projectsExpanded;}}
        class="mt-6 w-full items-center flex flex-row gap-4 lg:gap-6 text-gray-600 before:relative before:block before:flex-1 before:w-full before:h-px before:bg-gray-300 after:relative after:block after:flex-1 after:w-full after:h-px after:bg-gray-300 hover:underline"
      >
        {expandButtonText}
      </button>
    </section>

    <section class="mb-6 md:mb-10">
      <div class="flex flex-row justify-between items-center">
        <h2 class="heading2">Blog</h2>
        <a href="/blog.xml"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 mb-2"><path fill-rule="evenodd" d="M3.75 4.5a.75.75 0 0 1 .75-.75h.75c8.284 0 15 6.716 15 15v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75C18 11.708 12.292 6 5.25 6H4.5a.75.75 0 0 1-.75-.75V4.5Zm0 6.75a.75.75 0 0 1 .75-.75h.75a8.25 8.25 0 0 1 8.25 8.25v.75a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75v-.75a6 6 0 0 0-6-6H4.5a.75.75 0 0 1-.75-.75v-.75Zm0 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clip-rule="evenodd" /></svg></a>
      </div>
      <ul class="grid grid-flow-row grid-cols-1 md:grid-cols-2 gap-4">
        {#each Object.values(data.blogs) as blog}
          <BlogCard blog={blog} />
        {/each}
      </ul>
    </section>

    <div class="flex flex-row justify-between text-gray-500 text-xs">
      <a href="https://grantlemons.com/webring/prev" class="flex flex-col justify-center">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.205 8.72805L12.205 3.72805C13.2041 3.10363 14.5 3.82189 14.5 5.00004V15C14.5 16.1782 13.2041 16.8965 12.205 16.272L4.205 11.272C3.265 10.6845 3.265 9.31555 4.205 8.72805Z" />
        </svg>
      </a>
      <p class="mx-8">Come here from one of my friends' sites? Use these buttons to navigate the webring.</p>
      <a href="https://grantlemons.com/webring/next" class="flex flex-col justify-center">
        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.795 11.272L7.795 16.272C6.79593 16.8964 5.5 16.1782 5.5 15L5.5 5.00002C5.5 3.82186 6.79593 3.1036 7.795 3.72802L15.795 8.72802C16.735 9.31552 16.735 10.6845 15.795 11.272Z" />
        </svg>
      </a>
    </div>

  </main>
</div>
