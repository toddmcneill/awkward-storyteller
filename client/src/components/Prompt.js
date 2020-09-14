import React from 'react'
import styles from './Prompt.module.css'

export default function Prompt({ prompt }) {
  return <div>
    {
      prompt && (
        <div className={styles.prompt}>
          {prompt}
        </div>
      )
    }
  </div>
}