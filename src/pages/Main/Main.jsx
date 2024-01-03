import React, { useEffect, useRef, useState } from 'react'
import styles from './Main.module.scss'
import './Main.scss'
import Line from '@/components/Line/Line'
import UserPage from '@/components/UserPage/UserPage'
import Search from '@/components/Search/Search'
import { Tab, Tabs, TabsList, TabPanel } from '@mui/base';
import { useNavigate } from 'react-router';

const Main = () => {
  let selectedPath = location.pathname.replace('/', '')
  let navigateTo = useNavigate()
  
  // --------------------
  return (
    <div className={styles.Main}>
      <Tabs onChange={event => {
        event.target.id == 'userPage' ? navigateTo('/') : navigateTo(`/${event.target.id}`)
      }} defaultValue={selectedPath == 'line' ? 'line' :
                          selectedPath == 'search' ? 'search' :
                                                      'userPage'}>
        <TabsList className={styles.TabsList}>
          <Tab className={styles.Tab} value='line' id='line'>Лента</Tab>
          <Tab className={styles.Tab} value='search' id='search'>Поиск</Tab>
          <Tab className={styles.Tab} value='userPage' id='userPage'>Страничка</Tab>
        </TabsList>
        <TabPanel value='line'><Line/></TabPanel>
        <TabPanel value='search'><Search/></TabPanel>
        <TabPanel value='userPage'><UserPage/></TabPanel>
      </Tabs>
    </div>
  )
}

export default Main