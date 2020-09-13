import React from 'react'
import styles from './Chrome.module.css'
import Title from './Title'

export default function Chrome() {
  console.log(styles)

  return <div className={styles.mainGrid}>
    <div className={(styles.gridBox + ' ' + styles.gridHeader)}><Title /></div>
    <div className={(styles.gridBox + ' ' + styles.gridBoxFullWidth)}>A2</div>
    <div className={styles.gridBox}>B</div>
    <div className={styles.gridBox}>C</div>
    <div className={styles.gridBox}>D</div>
    <div className={(styles.gridBox + ' ' + styles.gridFooter)}>E</div>
  </div>
}
