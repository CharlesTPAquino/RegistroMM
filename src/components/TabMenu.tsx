import React from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'

export function TabMenu() {
  const navigate = useNavigate()
  const location = useLocation()

  const getTabValue = () => {
    switch (location.pathname) {
      case '/':
        return 0
      case '/employees':
        return 1
      case '/products':
        return 2
      default:
        return 0
    }
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/')
        break
      case 1:
        navigate('/employees')
        break
      case 2:
        navigate('/products')
        break
    }
  }

  return (
    <Box>
      <div className="title-container">
        <div className="title-text">MISTURA</div>
        <div className="title-text blue">MANIPULAÇÃO</div>
        <div className="title-text">MISTURA</div>
      </div>

      <Box className="tabs-container">
        <Tabs
          value={getTabValue()}
          onChange={handleChange}
          className="tabs-list"
        >
          <Tab label="Produção" className="tab-button" />
          <Tab label="Funcionários" className="tab-button" />
          <Tab label="Produtos" className="tab-button" />
        </Tabs>
      </Box>
    </Box>
  )
}
