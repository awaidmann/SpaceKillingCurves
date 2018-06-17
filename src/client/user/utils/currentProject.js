import { PROJECT } from '../../shared/settings'

export function currentProject(projects, settings) {
  if (projects) return projects.projects[settings[PROJECT].id]
}
