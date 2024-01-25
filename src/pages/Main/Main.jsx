import React, { useEffect, useRef, useState } from 'react'
import styles from './Main.module.scss'
import './Main.scss'
import { MyTabs } from '@/components/MyTabs/MyTabs'

const Main = () => {
  
  // --------------------
  return (
    <div className={styles.Main}>
      <MyTabs isTabPannel={true}/>
    </div>
  )
}

export default Main