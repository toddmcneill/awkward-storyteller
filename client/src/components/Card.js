import React from 'react'
import styles from './Card.module.css'

export default function Card({ text, isPlayed, isWild }) {
  const classes = [styles.card]
  if (isPlayed) {
    classes.push(styles.played)
  }
  if (isWild) {
    classes.push(styles.wild)
  }

  return <div className={classes.join(' ')}>
    <div className={styles.cardText}>{isWild ? '?' : text}</div>
  </div>
}
