import { FC } from "react"

import styles from './styles.module.scss'

export type PropertiesProps = {
  isVisible?: boolean
}

const Properties: FC<PropertiesProps> = () => {
  return <div className={styles.panel}></div>
}

export default Properties
