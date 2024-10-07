import type { PageLoad } from './$types';

import { blogJsonToObject } from '$lib/blogJsonToObject.server';
import { getProjects } from '$lib/getProjects.server';

export const load: PageLoad = async (p) => {
  let retval: any = {};

  // blog data
  retval.blogs  = await p.fetch('/blog/build/index.json')
    .then((res: Response) => res.json())
    .then((obj: Object) => blogJsonToObject(obj));

  retval.projects = await getProjects(p);

  return retval;
};

