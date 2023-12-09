import React, { cloneElement, useRef } from 'react'
import styles from './WithCarpet.module.scss'
import { useEffect } from 'react';

export const WithCarpet = ({children, activeClass}) => {
  let carpetRef = useRef()
  let childrenRef = useRef()
  !children.ref ? children = cloneElement(children, {ref: childrenRef}) : false
  let observer = new IntersectionObserver((entries) => {
    // entries - это все элементы на которые повешан observer
    if (entries[0].isIntersecting) {
      carpetRef.current.classList.add(styles.carpet_active)
    }
  }, {threshold: 0});
  useEffect(() => {
    observer.observe(children.ref.current)
  }, [children])

  // --------------------------------------
  return (
    <div>
      {children}
      <div ref={carpetRef} className={styles.carpet} onClick={() => {
        children.ref.current.classList.remove(activeClass)
        carpetRef.current.classList.remove(styles.carpet_active)
      }}></div>
    </div>
  )
}
