import * as R from 'ramda'
import * as RA from 'ramda-adjunct'
import produce from 'immer'
import { atomicActions } from '../actions/atomic';
import leafReducerCustom from './custom';
import LeafStandardAction from '../types/Actions/LSA';
import Dict from '../types/Dict';
import LeafReducerConfig from '../types/Leaf/Reducer/Config';
import LeafActionData from '../types/Leaf/Action/Data';
import { replaceAtIndex, insertAtIndex } from '../utils/array-utils';
import { updateState } from '../utils';
import generatePushID from '../utils/generate-pushid';

export const leafReducer = (
  leafState: any,
  action: LeafStandardAction,
  wholeState: any,
  initialWhole: any,
  reducersDict: Dict<LeafReducerConfig>
  ) => {

  const { leaf = {}, payload } = action;
  const { custom, creatorKey, path } = leaf as LeafActionData;

  if (custom) {
    return leafReducerCustom(leafState, action, wholeState, reducersDict)
  }

  // Type-agnostic actions
  switch (creatorKey) {
    case atomicActions.APPLY: return apply(payload, leafState, wholeState)
    case atomicActions.ASSIGN: return assign(leafState, payload)
    case atomicActions.CLEAR: return clear(leafState, payload)
    case atomicActions.CONCAT: return concat(leafState, payload)
    case atomicActions.DROP: return drop(leafState, payload)
    case atomicActions.FILTER: return filter(leafState, payload)
    case atomicActions.INCREMENT: return leafState + payload
    case atomicActions.OFF: return false
    case atomicActions.ON: return true
    case atomicActions.PUSH: return push(leafState, payload)
    case atomicActions.PUSHED_SET: return pushedSet(leafState, payload)
    // case atomicActions.REPLACE: return replace(leafState, payload)
    case atomicActions.RESET: return reset(initialWhole, path)
    case atomicActions.SET: return set(leafState, payload)
    case atomicActions.TOGGLE: return !leafState
    case atomicActions.UPDATE: return payload
    default: return leafState
  }
}

const apply = (callback: (leafState: any, treeState: any) => any, leafState: any, wholeState: any) => (
  callback(leafState, wholeState)
)

const assign = (state: object, sources: object[]) => Object.assign(
  { ...state },   // stop immer complaining
  ...sources
)

const clear = (leafState: any, toNull?: boolean) => {
  if (toNull) {
    return null
  } else if (RA.isBoolean(leafState)) {
    return false
  } else if (RA.isString(leafState)) {
    return ''
  } else if (RA.isArray(leafState)) {
    return []
  } else if (RA.isNumber(leafState)) {
    return 0
  } else if (RA.isPlainObject(leafState)) {
    return {}
  }
}

const concat = (leafState: any[] | string, payload: any) => leafState.concat(payload)

const drop = (leafState: any[], n: number = 1) => R.drop(n, leafState)

const filter = (leafState: any[], callback: (element: any, index: number, array: any[]) => any[]) => leafState.filter(callback)

const push = (
  leafState: any[],
  { element, index = -1, replace = false }: {
    element: any, index?: number, replace?: boolean
  }) => (
    replace
      ? replaceAtIndex(leafState, index, element)
      : insertAtIndex(leafState, index, element)
  )

const pushedSet = (state: object, valueOrCallback: any) => {
  const pushId: string = generatePushID()
  return typeof valueOrCallback === 'function'
    ? set(state, { path: [pushId], value: valueOrCallback(pushId) })
    : set(state, { path: [pushId], value: valueOrCallback })
}

// const replace = (
//   leafState: string,
//   { pattern, replacement }: { pattern: string | RegExp, replacement: string }
// ) => leafState.replace(pattern, replacement)

const reset = (initialWholeState: any, path: (string | number)[]) => (
  path.length >= 1 ? R.path(path, initialWholeState) : initialWholeState
)

const set = (state: object, { path, value }: { path: (string | number)[], value: any }) => updateState(state, path, value)