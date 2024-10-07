<script lang='ts'>
  import { slide } from 'svelte/transition';
  import type { Project } from '$lib/types.ts';
  export let project: Project;
</script>

<li in:slide={{duration: 150}} out:slide={{duration: 275}} class="group overflow-hidden border hover:border-gray-400 rounded-xl sm:min-w-[250px]">
  <a href={project.url} class="flex flex-col size-full rounded-xl">
    <div class="grow flex flex-col p-4">
      <h3 class="font-bold text-xl mb-2">
        {project.name}
        {#if project.hackathonName !== undefined}
          <span class="font-normal text-gray-600">{`[${project.hackathonName}]`}</span>
        {/if}
      </h3>
      <p class="text-sm text-gray-600 mb-4">{project.category}</p>
      <p class="grow">{project.description}</p>
      <p class="mt-2 text-sm text-gray-600">{project.languages.join(', ')}</p>
    </div>
    <footer class="flex justify-end items-center bg-gray-200">
      <div class="m-2 sm:m-3 flex">
        <div class="flex items-center px-4">
          <p class="text-sm">{project.bottomText}</p>
        </div>
        <div class="flex place-items-center w-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="relative left-0 group-hover:left-1 size-4 transition-all duration-100">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </div>
    </footer>
  </a>
</li>
