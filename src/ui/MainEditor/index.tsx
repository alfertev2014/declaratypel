import { FC } from "react"

import styles from './styles.module.scss'

export type MainEditorProps = {
  isVisible?: boolean
}

const MainEditor: FC<MainEditorProps> = () => {
  return (
    <div className={styles.container}>
      <div className={styles.editingArea}>

      </div>
    </div>
  )
}

export default MainEditor
