import LeafCreatorCondition from "../../Creator/Condition";

type LeafActionData = {
  path: (string | number)[]
  creatorKey: string
  CREATOR_KEY: string
  compound: false
  condition?: LeafCreatorCondition
  custom?: boolean
}

export default LeafActionData