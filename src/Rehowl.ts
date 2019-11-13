import useHowl, { UseHowlState } from './useHowl'

interface Props {
  src: string | string[]
  sprite?: IHowlSoundSpriteDefinition
  format?: string[]
  html5?: boolean
  preload?: boolean
  xhrWithCredentials?: boolean
  children?: (props: UseHowlState) => JSX.Element
}

export default function Rehowl(props: Props) {
  const { children, src, sprite, format, html5, preload, xhrWithCredentials } = props

  const { howl, error, state, load } = useHowl({
    src,
    sprite,
    format,
    html5,
    preload,
    xhrWithCredentials,
  })

  if (!children || !howl) return null
  return children({ howl, error, state, load })
}
