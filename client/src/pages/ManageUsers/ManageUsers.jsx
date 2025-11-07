import React, { useEffect, useState } from 'react'
import './ManageUsers.css'
import UserForm from '../../components/UserForm/UserForm'
import UsersList from '../../components/UsersList/UsersList'
import { fetchUsers } from '../../Service/UserService';
import toast from 'react-hot-toast';
const ManageUsers = () => {


  const[users,setUsers]=useState([])
  const[loading,setLoading]=useState(false)

  useEffect(()=>{
    async function fetchUser()
    {
      try {
        setLoading(true);
        const resposne=await fetchUsers();
        setUsers(resposne.data)
        
      } catch (error) {
        console.log(error);
        toast.error("Unable to fetch users!!")
        
        
      }
      finally{
        setLoading(false);
      }
    }
    fetchUser();
  },[])
  return (
    <div className="users-container text-light">
         <div className="left-column">
            <UserForm setUsers={setUsers}/>

         </div>
         <div className="right-column"> 
            <UsersList users={users} setUsers={setUsers}/>

            
            </div>
            </div>
  )
}

export default ManageUsers
