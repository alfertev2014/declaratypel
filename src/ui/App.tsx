import MainEditor from "./MainEditor"
import Properties from "./Properties"
import Structure from "./Structure"

import styles from './styles.module.scss'

function App() {
  return (
    <div className={styles.App}>
      <Structure />
      <MainEditor />
      <Properties />
    </div>
  )
}

export default App
