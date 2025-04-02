import type { GitHubAPIResponse, Project } from "$lib/types";
import { ProjectType } from "$lib/types";

import imageSizeFromFile from "image-size";
import { marked } from "marked";

const LANG_EXCLUDES = ["Dockerfile", "Makefile"];

async function getDescription(
  projectName: string,
  fetchFunc: typeof fetch,
): Promise<string> {
  const res: Response = await fetchFunc(
    `/projects/descriptions/${projectName}.md`,
  );
  if (!res.ok) {
    return "<p>(no description provided)</p>";
  }
  return marked(await res.text());
}

/* return a Project modified to include metadata fetched from the Github API */
async function createGithubProject(
  projectName: string,
  project: Project,
  fetchFunc: typeof fetch,
): Promise<Project> {
  // TODO: properly inspect the response instead of blindly catching all exceptions
  try {
    const res: Response = await fetchFunc(
      `https://api.github.com/repos/b-sharman/${projectName}`,
    );
    const githubProject: GitHubAPIResponse = await res.json();

    // set project.languages by querying the URL returned by the API
    const lang_res = await fetchFunc(githubProject.languages_url);
    const lang_json = await lang_res.json();
    // when we are rate limited, the response includes a "message" field
    if ("message" in lang_json) {
      project.languages = [];
      console.log(
        `skipping languages for project ${githubProject.name} because of Github API rate limiting`,
      );
    } else {
      project.languages = Object.keys(lang_json).filter(
        (lang) => !LANG_EXCLUDES.includes(lang),
      );
    }

    project.bottomText = "see it on GitHub";
    project.description = githubProject.description;
    project.name = githubProject.name;
    project.url = githubProject.html_url;
  } catch {
    // https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
    project.bottomText = "";
    project.category = "error";
    project.description = "probably got rate limited by the GitHub API =/";
    project.languages = [];
    project.name = projectName;
    project.type = ProjectType.NetworkError;
    project.url = "";
  }

  // grab description from associated markdown file
  project.description = await getDescription(projectName, fetchFunc);

  return project;
}

/* return a Project initialized from JSON in project.json */
async function createBlogProject(
  projectName: string,
  project: Project,
  fetchFunc: typeof fetch,
): Promise<Project> {
  project.bottomText = "read the blog post";
  project.url = `/blog/${projectName}`;

  // grab description from associated markdown file
  project.description = await getDescription(projectName, fetchFunc);

  return project;
}

export async function getProjects(fetchFunc: typeof fetch): Promise<Project[]> {
  const projects: Project[] = [];

  const res: Response = await fetchFunc("/projects/projects.json");
  if (!res.ok) {
    console.error("Failed to fetch from projects.json");
    return projects;
  }

  for (const [projectName, project] of Object.entries(await res.json()) as [
    string,
    Project,
  ][]) {
    if (project.image !== undefined) {
      const { width, height } = await imageSizeFromFile(
        `static/${project.image.path}`,
      );
      if (width !== undefined && height !== undefined) {
        project.image.width = width;
        project.image.height = height;
      }
    }
    switch (project.type) {
      case "github":
        projects.push(
          await createGithubProject(projectName, project, fetchFunc),
        );
        break;

      case "blog":
        projects.push(await createBlogProject(projectName, project, fetchFunc));
        break;

      default:
        console.error(
          `Error when parsing projects: unrecognized project type ${project.type}`,
        );
    }
  }

  return projects;
}
