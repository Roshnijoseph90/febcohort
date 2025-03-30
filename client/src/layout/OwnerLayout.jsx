import React from 'react'
import { Outlet } from 'react-router-dom'

const OwnerLayout = () => {
  return (
    <div>
     <h3> owner Header</h3>
     <Outlet/>
     <h3>Owner footer</h3>
    </div>
  )
}

export default OwnerLayout
