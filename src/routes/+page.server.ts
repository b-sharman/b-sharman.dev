import type { PageLoad } from './$types';

import { blogJsonToObject, getBlogsAsJson } from '$lib/blogUtils.server';
import { getProjects } from '$lib/getProjects.server';

export const load: PageLoad = async (p) => {
  let retval: any = {};

  // blog data
  retval.blogs  = await getBlogsAsJson(p.fetch)
    .then((obj: Object) => blogJsonToObject(obj));

  retval.projects = await getProjects(p);

  return retval;
};

