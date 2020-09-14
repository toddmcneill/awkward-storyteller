import React, { useState } from 'react'
import Card from './Card'
import styles from './CardList.module.css'

export default function CardList({ cards }) {
  const [ selectedCard, setSelectedCard ] = useState(null)

  function handleCardClick(card) {
    return e => {
      if (selectedCard === card) {
        setSelectedCard(null)
      } else {
        setSelectedCard(card)
      }
    }
  }

  return <div className={styles.cardList}>
    {cards.map((card, i) => {
      const classes = [styles.cardContainer]
      if (selectedCard) {
        if (card === selectedCard) {
          classes.push(styles.selected)
        } else {
          classes.push(styles.unselected)
        }
      }

      return <div key={i} className={classes.join(' ')} onClick={handleCardClick(card)}>
        <Card text={card.text} isPlayed={card.isPlayed} isWild={card.isWild} />
      </div>
    })}
  </div>
}
