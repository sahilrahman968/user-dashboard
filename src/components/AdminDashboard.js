import { useEffect, useState } from 'react'
import { Checkbox,Button,Empty } from 'antd'
import './AdminDashboard.css'
import icondelete from '../assets/icondelete.png'
import edit from "../assets/edit.png"

function AdminDashboard() {
  const [allUsers, setAllUsers] = useState([])
  const [index, setIndex] = useState({ start: 0, end: 9 })
  const [paginationArr, setPaginationArr] = useState([])
  const [deleteUsers, setDeleteUsers] = useState([])
  const [activeUserArr, setActiveUserArr] = useState([])
  const [searchOn , setSearchOn] = useState(false);
  const [showEdit,setShowEdit] = useState({id:"",name:false,email:false});

  useEffect(()=>{
   if(!searchOn){
     setActiveUserArr(allUsers)
   }
  },[searchOn])

  useEffect(() => {
    fetch(
      'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
    )
      .then((res) => res.json())
      .then((users) => {
        setAllUsers(users)
      })
      .catch((err) => console.log(err))
  }, [])

  useEffect(()=>{
   setActiveUserArr([...allUsers])
  },[allUsers])

  useEffect(() => {
    let arr = []
    for (let i = 10; i <= Math.ceil(activeUserArr.length / 10) * 10; i = i + 10) {
      if (i === 10) arr.push({ id: i, active: true })
      else arr.push({ id: i, active: false })
    }
    setPaginationArr(arr)
  }, [activeUserArr])

  const paginationHandler = (index) => {
    setIndex({ start: index - 10, end: index - 1 })
    paginationArr.map((e) => {
      if (e?.id === index) {
        e.active = true
      } else {
        e.active = false
      }
    })
  }

  const deleteSelectedHandler = () => {
    let arr1 = deleteUsers?.sort(function (a, b) {
      return a.id - b.id || a.name.localeCompare(b.name)
    })

    let arr2 = activeUserArr
      ?.slice(index?.start, index?.end + 1)
      ?.sort(function (a, b) {
        return a.id - b.id || a.name.localeCompare(b.name)
      })

    if (JSON.stringify(arr2) === JSON.stringify(arr1)) {
      setIndex({ start: 0, end: 9 })
    } 

    let arr = activeUserArr
    deleteUsers?.forEach((user) => {
      let index = activeUserArr?.findIndex((e) => e?.id === user?.id)
      if (index > -1) {
        arr.splice(index, 1)
      }
    })
    setAllUsers([...arr])
    setDeleteUsers([])
  }

  const deleteOneUser = (arg) => {
   let index = activeUserArr?.findIndex((user) => user?.id === arg?.id)
   let index1 = activeUserArr?.findIndex((user) => user?.id === arg?.id)
    if(index>-1){
     let arr = activeUserArr;
     let arr1 = deleteUsers;

     arr.splice(index,1);
     arr1.splice(index1, 1)

     setAllUsers([...arr])
     setDeleteUsers([...arr1])

    }
  }

  const onChangeCheckbox = (arg) => {
    let index = deleteUsers?.findIndex((user) => user?.id === arg?.id)
    if (index > -1) {
      let arr = deleteUsers
      arr.splice(index, 1)
      setDeleteUsers([...arr])
    } else {
      let arr = deleteUsers
      arr.push(arg)
      setDeleteUsers([...arr])
    }
  }

  const isChecked = (arg) => {
    let index = deleteUsers?.findIndex((user) => user?.id === arg?.id)
    if (index > -1) {
      return true
    } else {
      return false
    }
  }

  const isAllSelectChecked = () => {
    let arr1 = deleteUsers?.sort(function (a, b) {
      return a.id - b.id || a.name.localeCompare(b.name)
    })

    let arr2 = activeUserArr
      ?.slice(index?.start, index?.end + 1)
      ?.sort(function (a, b) {
        return a.id - b.id || a.name.localeCompare(b.name)
      })

    if (JSON.stringify(arr2) === JSON.stringify(arr1)) {
      return true
    } else {
      return false
    }
  }

  const selectAllHandler = () => {
    let arr1 = deleteUsers?.sort(function (a, b) {
      return a.id - b.id || a.name.localeCompare(b.name)
    })

    let arr2 = activeUserArr
      ?.slice(index?.start, index?.end + 1)
      ?.sort(function (a, b) {
        return a.id - b.id || a.name.localeCompare(b.name)
      })

    if (JSON.stringify(arr2) === JSON.stringify(arr1)) {
      setDeleteUsers([])
    } else {
      setDeleteUsers([...activeUserArr?.slice(index?.start, index?.end + 1)])
    }
  }

  const onSearchHandler = (e) => {
   // console.log("target",e.target.value);
   let arr = [];
   arr = allUsers?.filter(
     (item) =>
       item?.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
       item?.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
       item?.role.toLowerCase().includes(e.target.value.toLowerCase())
   )
   if(e?.target?.value?.length>0){
    setSearchOn(true);
    setActiveUserArr(arr)
   }
   else{
    setSearchOn(false)
   }
   console.log('target', arr)
  }

  const editButtonHandler = (e,type,user) => {
    let arr1 = allUsers
    let arr2 = activeUserArr 
    let index1 = arr1.findIndex(e=>e?.id===user?.id)
    let index2 = arr2.findIndex((e) => e?.id === user?.id)

    if (e.key === 'Enter') {
      switch (type) {
        case 'name': {
          arr1[index1].name = e?.target?.value
          arr2[index2].name = e?.target?.value
          setAllUsers([...arr1])
          setActiveUserArr([...arr2])
          setShowEdit({ ...showEdit, name: false })
          break;
        }
        case 'email': {
          arr1[index1].email = e?.target?.value
          arr2[index2].email = e?.target?.value
          setAllUsers([...arr1])
          setActiveUserArr([...arr2])
          setShowEdit({ ...showEdit, email: false })
          break;
        }
        default:console.log("")
      }
      console.log('target', e?.target.value)
    }
  }

  return (
    <div className='AdminDashboard'>
      <h2>Dashboard</h2>
      <input
        className='input-box'
        onChange={(e) => {
          onSearchHandler(e)
        }}
        placeholder='Search by name, email or role'
      />
      <>
        <table className='table'>
          <thead>
            <tr className='table-header'>
              <th className='td-checkbox'>
                <Checkbox
                  disabled={activeUserArr?.length === 0}
                  checked={
                    activeUserArr?.length === 0 ? false : isAllSelectChecked()
                  }
                  onChange={() => {
                    selectAllHandler()
                  }}
                ></Checkbox>
              </th>
              <th className='td-name'>Name</th>
              <th className='td-email'>Email</th>
              <th className='td-role'>Role</th>
              <th className='td-action'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeUserArr?.length > 0 ? (
              activeUserArr
                ?.slice(index?.start, index?.end + 1)
                ?.map((user) => {
                  return (
                    <tr
                      className={isChecked(user) ? 'selected-row' : ''}
                      key={user?.id}
                    >
                      <td className='td-checkbox'>
                        <Checkbox
                          checked={isChecked(user)}
                          onChange={() => {
                            onChangeCheckbox(user)
                          }}
                        ></Checkbox>
                      </td>
                      <td className='td-name'>
                        {user?.name}{' '}
                        {showEdit?.id === user?.id &&
                        showEdit?.name ? (
                          <input
                            type='text'
                            placeholder='enter new name'
                            onKeyDown={(e) => {
                              editButtonHandler(e, 'name', user)
                            }}
                          />
                        ) : (
                          <></>
                        )}
                      </td>
                      <td className='td-email'>
                        {user?.email}{' '}
                        {showEdit?.id === user?.id &&
                        showEdit?.email ? (
                          <input
                            type='text'
                            placeholder='enter new e-mail'
                            onKeyDown={(e) => {
                              editButtonHandler(e, 'email', user)
                            }}
                          />
                        ) : (
                          <></>
                        )}
                      </td>
                      <td className='td-role'>{user?.role}</td>
                      <td className='td-action'>
                        <img
                          className='icon'
                          src={edit}
                          onClick={() => {
                            if (showEdit?.id === user?.id)
                              setShowEdit({ id: '', name: false, email: false })
                            else
                              setShowEdit({
                                id: user?.id,
                                name: true,
                                email: true,
                              })
                          }}
                        />
                        <img
                          className='icon'
                          src={icondelete}
                          onClick={() => {
                            deleteOneUser(user)
                          }}
                        />
                      </td>
                    </tr>
                  )
                })
            ) : (
              <Empty />
            )}
          </tbody>
        </table>
        {activeUserArr?.length > 0 ? (
          <div style={{ position: 'relative' }}>
            <Button
              className={
                deleteUsers?.length > 0
                  ? 'delete-selected'
                  : 'delete-selected delete-selected-disabled'
              }
              disabled={deleteUsers?.length > 0 ? false : true}
              style={{
                position: 'absolute',
                left: '120px',
                top: '0',
                marginLeft: '20px',
              }}
              onClick={() => {
                deleteSelectedHandler()
              }}
            >
              Delete Selected
            </Button>
            <div className='pagination'>
              <div
                onClick={() => {
                  if (index?.end !== 9) {
                    setIndex({ start: 0, end: 9 })
                    paginationArr.map((e) => {
                      if (e?.id - 1 === 9) {
                        e.active = true
                      } else {
                        e.active = false
                      }
                    })
                  }
                }}
                className={
                  index?.end === 9
                    ? 'pagination-button-disabled'
                    : 'pagination-button'
                }
              >
                {'<<'}
              </div>
              <div
                onClick={() => {
                  if (index?.end !== 9) {
                    setIndex({ start: index?.start - 10, end: index?.end - 10 })
                    paginationArr.map((e) => {
                      if (e?.id === index?.end - 9) {
                        e.active = true
                      } else {
                        e.active = false
                      }
                    })
                  }
                }}
                className={
                  index?.end === 9
                    ? 'pagination-button-disabled'
                    : 'pagination-button'
                }
              >
                {'<'}
              </div>
              {paginationArr?.map((e) => {
                return (
                  <div
                    className={
                      e?.active
                        ? 'active-pagination-button'
                        : 'pagination-button'
                    }
                    key={e?.id}
                    onClick={() => {
                      setDeleteUsers([])
                      setShowEdit({ id: '', name: false, email: false })
                      paginationHandler(e?.id)
                    }}
                  >
                    {e?.id / 10}
                  </div>
                )
              })}
              <div
                onClick={() => {
                  if (
                    index?.end !==
                    paginationArr?.[paginationArr?.length - 1]?.id - 1
                  ) {
                    setIndex({ start: index?.start + 10, end: index?.end + 10 })
                    paginationArr.map((e) => {
                      if (e?.id === index?.end + 11) {
                        e.active = true
                      } else {
                        e.active = false
                      }
                    })
                  }
                }}
                className={
                  index?.end ===
                  paginationArr?.[paginationArr?.length - 1]?.id - 1
                    ? 'pagination-button-disabled'
                    : 'pagination-button'
                }
              >
                {'>'}
              </div>
              <div
                onClick={() => {
                  if (
                    index?.end !==
                    paginationArr?.[paginationArr?.length - 1]?.id - 1
                  ) {
                    setIndex({
                      start: paginationArr[paginationArr?.length - 1]?.id - 10,
                      end: paginationArr[paginationArr?.length - 1]?.id - 1,
                    })

                    paginationArr.map((e) => {
                      if (
                        e?.id === paginationArr[paginationArr?.length - 1]?.id
                      ) {
                        e.active = true
                      } else {
                        e.active = false
                      }
                    })
                  }
                }}
                className={
                  index?.end ===
                  paginationArr?.[paginationArr?.length - 1]?.id - 1
                    ? 'pagination-button-disabled'
                    : 'pagination-button'
                }
              >
                {'>>'}
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </>
    </div>
  )
}

export default AdminDashboard
