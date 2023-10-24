/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as u from './urx'
import { propsReadySystem } from './propsReadySystem'
import { domIOSystem } from './domIOSystem'
import { listStateSystem } from './listStateSystem'
import { windowScrollerSystem } from './windowScrollerSystem'

export const initialScrollTopSystem = u.system(
  ([{ didMount }, { scrollTo }, { listState }, { externalWindow }]) => {
    const initialScrollTop = u.statefulStream(0)

    u.subscribe(
      u.pipe(
        didMount,
        u.withLatestFrom(initialScrollTop),
        u.filter(([, offset]) => offset !== 0),
        u.map(([, offset]) => ({ top: offset })),
        u.withLatestFrom(externalWindow)
      ),
      ([location, wi]) => {
        u.handleNext(
          u.pipe(
            listState,
            u.skip(1),
            u.filter((state) => state.items.length > 1)
          ),
          () => {
            const w = wi || window
            w.requestAnimationFrame(() => {
              u.publish(scrollTo, location)
            })
          }
        )
      }
    )

    return {
      initialScrollTop,
    }
  },
  u.tup(propsReadySystem, domIOSystem, listStateSystem, windowScrollerSystem),
  { singleton: true }
)
