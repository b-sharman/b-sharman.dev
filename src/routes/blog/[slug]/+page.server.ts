import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { marked } from 'marked';

export const load: PageLoad = async (p) => {
  let firstImage: string = "";
  let firstImageAlt: string = "";

  const renderer = {
    // this is just the defualt renderer
    // https://github.com/markedjs/marked/blob/master/src/Renderer.ts#L135-L148
    // but modified to wrap everything in a <figure> and use titles as captions
    image(href: string, title: string | null, text: string): string {
      if (href === "") return text;
      if (firstImage === "") {
        firstImage = href;
        firstImageAlt = text;
      }
      let out = `<figure class="flex flex-col text-center"><img src="/blog/images/${p.params.slug}/${href}" alt="${text}" class="mx-auto" />`;
      if (title) {
        out += `<figcaption>${title}</figcaption>`;
      }
      out += '</figure>';
      return out;
    }
  }
  marked.use({ renderer });

  const blogs = await p.fetch('/blog/build/index.json')
    .then(res => res.json());
  if (!Object.keys(blogs).includes(p.params.slug)) return error(404, 'Not found');

  let retval = blogs[p.params.slug];
  const text = await p.fetch(`/blog/build/${retval["slug"]}.md`)
    .then(res => res.text());
  retval.html = marked(text);

  // ended up hardcoding because I didn't want to have to set up env variables or something else nasty
  // (p.url doesn't work with prerendering; it only resolves after javascript is called, which most sites don't like)
  // retval.url = p.url.toString();
  retval.url = `https://b-sharman.dev/blog/${retval["slug"]}/`;
  retval.firstImage = `https://b-sharman.dev/blog/images/${retval["slug"]}/${firstImage}`;
  retval.firstImageAlt = firstImageAlt;

  return retval;
};
