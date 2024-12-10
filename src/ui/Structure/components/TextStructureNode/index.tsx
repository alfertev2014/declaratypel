import { FC } from "react"

export type TextStructureNodeProps = {
  text: string
}

const TextStructureNode: FC<TextStructureNodeProps> = ({ text }) => {
  return (
    <div><p>{text}</p></div>
  )
}

export default TextStructureNode