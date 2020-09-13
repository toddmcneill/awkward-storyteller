import React from 'react'
import globalStyles from '../App.module.css'

export default function Button({ children, ...props }) {
  return <div className={globalStyles.button} {...props}>{children}</div>
}
