import { createStore } from "redux";
import reduxLeaves from '../../src';

describe.skip("leaf.create.assign(...sources): returns an action that, when dispatched, updates the leaf's state by non-mutatively copying over properties from the sources", () => {
  const initialState = {
    foo: { props: true },
    bar: { props: false }
  }

  const [reducer, actions] = reduxLeaves(initialState)
  const store = createStore(reducer)

  test("Assigning new properties", () => {
    const assignToFoo = actions.foo.create.assign
    store.dispatch(assignToFoo({ count: 2 }))
    expect(store.getState().foo).toEqual({ props: true, count: 2 })
  })

  test("Overwriting properties", () => {
    const assignToBar = actions.bar.create.assign
    store.dispatch(assignToBar({ props: true }))
    expect(store.getState().bar).toEqual({ props: true })
  })
})