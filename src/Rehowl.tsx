import { useHowl } from './useHowl'
import type { IUseHowlState, IUseHowlOptions } from './useHowl'

interface Props extends IUseHowlOptions {
  /** Child component that receives render props. */
  children: (props: IUseHowlState) => JSX.Element
}

/**
 * Render prop access to a Howl instance for use with `<Play />`.
 *
 * Recommended when using Rehowl from a class component. If you're
 * using a function component, it's best to use `useHowl`.
 */
export function Rehowl(props: Props) {
  const { children, src, sprite, format, html5, preload, xhr } = props

  const { howl, error, state, load } = useHowl({
    src,
    sprite,
    format,
    html5,
    preload,
    xhr,
  })

  if (!children || !howl) return null
  return children({ howl, error, state, load })
}
