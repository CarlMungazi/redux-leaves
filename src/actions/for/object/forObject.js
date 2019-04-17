import { atomicActions } from "../../atomic";
import { conditions } from '../../condtions/conditions';
import { makeActionTemplate } from "../utils";

export const forObject = (pathToLeafOrBranch = []) => {
  const actionTemplate = makeActionTemplate(
    pathToLeafOrBranch,
    { condition: conditions.OBJECT }
  )

  const set = (path, value) => actionTemplate(atomicActions.SET, { path, value })

  return {
    set
  }
}