export function currentProject(projects, settings) {
  if (projects) return projects.projects[settings.project.id]
}
