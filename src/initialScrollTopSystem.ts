import * as u from './urx'
import { propsReadySystem } from './propsReadySystem'
import { domIOSystem } from './domIOSystem'
import { listStateSystem } from './listStateSystem'
import { myRequestAnimationFrame } from './hooks/animate_frame'
import { windowScrollerSystem } from './windowScrollerSystem'

export const initialScrollTopSystem = u.system(
  ([{ didMount }, { scrollTo }, { listState }, { externalWindow }]) => {
    const initialScrollTop = u.statefulStream(0)

    u.subscribe(
      u.pipe(
        didMount,
        u.withLatestFrom(initialScrollTop),
        u.filter(([, offset]) => offset !== 0),
        u.map(([, offset]) => ({ top: offset }))
      ),
      (location) => {
        u.handleNext(
          u.pipe(
            u.combineLatest(listState, externalWindow),
            u.skip(1),
            u.filter(([state]) => state.items.length > 1)
          ),
          ([_, wi]) => {
            const w = wi || window
            console.log(w)
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
