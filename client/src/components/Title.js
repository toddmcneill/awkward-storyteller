import React from 'react'
import styles from './Title.module.css'

export default function Title() {
  return <div className={styles.title}>
    <div></div>
    <div>
      <div className={styles.the}>The</div>
      <div className={styles.awkward}>Awkwa<span className={styles.mirrored}>r</span>d</div>
      <div className={styles.storyteller}>Storyteller</div>
    </div>
    <div></div>
  </div>
}
