import { VITE_URL } from "$env/static/private";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

import hljs from "highlight.js/lib/common";
import imageSizeFromFile from "image-size";
import { marked } from "marked";

import { getBlogsAsJson } from "$lib/blogUtils.server";
import type { Blog, RenderBlog } from "$lib/types";

// how many other blogs to put in the "Recent Posts" section
const RECENT_LIMIT = 4;

export const load: PageServerLoad = async ({
  fetch,
  params,
}): Promise<RenderBlog> => {
  const blogsJson = await getBlogsAsJson(fetch);

  // grab the data provided by the json file using the slug provided by svelte
  const builder = blogsJson[params.slug];
  // return 404 if the data has no slug
  if (builder === undefined) return error(404, "Not found");

  const renderer = {
    // these are modifications of the default renderer
    // https://github.com/markedjs/marked/blob/master/src/Renderer.ts

    code(text: string, lang: string): string {
      const langString: string | undefined = (lang || "").match(/^\S*/)?.[0];

      let code = `${text.replace(/\n$/, "")}\n`;

      if (!langString) {
        code = `<pre><code>${code}</code></pre>\n`;
        return code;
      }

      try {
        code = hljs.highlight(code, { language: langString }).value;
      } finally {
        code = `<pre><code class="language-${langString}">${code}</code></pre>\n`;
      }
      return code;
    },

    image(href: string, title: string | null, text: string): string {
      if (href === "") return text;
      const imgPath = `/blog/images/${params.slug}/${href}`;
      const { width, height } = imageSizeFromFile(`static${imgPath}`);
      let out = `<figure class="flex flex-col text-center"><img src=${imgPath} width="${width}" height="${height}" alt="${text}" class="mx-auto" />`;
      if (title) {
        out += `<figcaption>${marked(title)}</figcaption>`;
      }
      out += "</figure>";
      return out;
    },
  };
  marked.use({ renderer });

  let html = "";
  try {
    const res = await fetch(`/blog/build/${params.slug}.md`);
    if (!res.ok)
      throw Error(`failed to fetch from /blog/build/${params.slug}.md`);
    const text = await res.text();
    html = await marked(text);
  } catch (e: unknown) {
    console.error(e);
    throw e;
  }

  const ldjson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: builder.title,
    image: builder.previewImage ? builder.previewImage.path : undefined,
    datePublished: new Date(builder.date * 1000).toISOString(),
    author: [
      {
        "@type": "Person",
        name: "Byron Sharman",
        url: VITE_URL,
      },
    ],
  });

  const recentBlogs: { [slug: string]: Blog } = {};
  let num = 0;
  // populate recentBlogs with the first RECENT_LIMIT blogs that are not the same as the current blog
  for (const slug of Object.getOwnPropertyNames(blogsJson)) {
    if (slug !== params.slug) {
      recentBlogs[slug] = blogsJson[slug];
      num++;
    }
    if (num >= RECENT_LIMIT) break;
  }

  const retval: RenderBlog = {
    ...builder,
    absoluteUrl: VITE_URL + builder.url,
    html: html,
    ldjson: ldjson,
    recentBlogs: recentBlogs,
  };
  return retval;
};
