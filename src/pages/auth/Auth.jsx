import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../components/shared/header/Header'

const Auth = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

export default Auth