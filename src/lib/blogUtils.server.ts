import type { Blog } from '$lib/types';

/* pass in Response.json() and get back a Blog[] */
export function blogJsonToObject(obj: Object, shouldSlice: boolean = false) {
  let entries = Object.entries(obj);
  if (shouldSlice) entries = entries.slice(1, 5);
  return entries.map(
    ([key, value]: [string, any]) => {
      return {...value, slug: key};
    }
  ) as Blog[];
}

export async function getBlogsAsJson(fetchFunc: Function) {
  return await fetchFunc('/blog/build/index.json')
    .then((res: Response) => res.json());
}
