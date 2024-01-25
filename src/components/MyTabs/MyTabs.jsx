import React from 'react'
import styles from './MyTabs.module.scss'
import { Tab, Tabs, TabsList, TabPanel } from '@mui/base';
import { useNavigate } from 'react-router';
import Line from '@/components/Line/Line'
import UserPage from '@/components/UserPage/UserPage'
import Search from '@/components/Search/Search'

export const MyTabs = ({isTabPannel}) => {
  let selectedPath = location.pathname.replace('/', '')
  let navigateTo = useNavigate()

  return (
    <div>
    <Tabs onChange={event => {
      event.target.id == 'userPage' ? navigateTo('/') : navigateTo(`/${event.target.id}`)
    }} defaultValue={isTabPannel && selectedPath == 'line' ? 'line' :
                     isTabPannel && selectedPath == 'search' ? 'search' :
                     isTabPannel ? 'userPage' : null}>
      <TabsList className={styles.TabsList}>
        <Tab className={styles.Tab} value='line' id='line'>Лента</Tab>
        <Tab className={styles.Tab} value='search' id='search'>Поиск</Tab>
        <Tab className={styles.Tab} value='userPage' id='userPage'>Страничка</Tab>
      </TabsList>
      { isTabPannel ? <>
        <TabPanel value='line'><Line/></TabPanel>
        <TabPanel value='search'><Search/></TabPanel>
        <TabPanel value='userPage'><UserPage/></TabPanel>
      </> : null}
    </Tabs>
    </div>
  )
}
