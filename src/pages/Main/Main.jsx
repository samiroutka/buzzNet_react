import React, { useEffect, useRef, useState } from 'react'
import styles from './Main.module.scss'
import './Main.scss'
import Line from '../../components/Line/Line'
import UserPage from '../../components/UserPage/UserPage'
import Search from './../../components/Search/Search'
import { Tab, Tabs, TabsList, TabPanel } from '@mui/base';

const Main = () => {
  // --------------------
  return (
    <div className={styles.Main}>
      <Tabs defaultValue='userPage'>
        <TabsList className={styles.TabsList}>
          <Tab className={styles.Tab}>Лента</Tab>
          <Tab className={styles.Tab}>Поиск</Tab>
          <Tab className={styles.Tab} value='userPage'>Страничка</Tab>
        </TabsList>
        <TabPanel><Line/></TabPanel>
        <TabPanel><Search/></TabPanel>
        <TabPanel value='userPage'><UserPage/></TabPanel>
      </Tabs>
    </div>
  )
}

export default Main