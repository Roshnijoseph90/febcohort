import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div>
     <h3> admin Header</h3>
     <Outlet/>
     <h3>admin footer</h3>
    </div>
  )
}
export default AdminLayout