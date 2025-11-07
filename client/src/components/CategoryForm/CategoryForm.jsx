import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { addCategory } from '../../Service/CategoryService'
import { AppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const CategoryForm = () => {
    
    const{categories,setCategories}=useContext(AppContext);


    const[loading,setLoading]=useState(false)
    const[image,setImage]=useState(false)
    const[data,setData]=useState({
        name:'',
        description:'',
        bgColor:"#2c2c2c"
    })

    const onChangeHandler=(e)=>{
        const value=e.target.value;
        const name=e.target.name;
        setData((data)=>({...data,[name]:value}))
    }

    const onSubmitHandler=async(e)=>{
        e.preventDefault();
       
        if(!image){
            toast.error("Please select the image")
            return;
        }
        setLoading(true);
        const formData=new FormData();
        formData.append("category",JSON.stringify(data))
        formData.append("file",image)

        try{
           const response= await addCategory(formData);
           if(response.status===201)
           {

            setCategories([...categories,response.data]);
            toast.success("Category Added")
            setData({
                name:'',
                description:'',
                bgColor:"2c2c2c"
            })
            setImage(false)
           }
        }

        catch(error)
        {
            console.error(error)
            toast.error("Error Adding Category")
        }
        finally{
            setLoading(false)
        }

    }

    useEffect(()=>{
        console.log(data)

    },[data])
  return (
  <div className="mx-2 mt-2">
    <div className="row">
        <div className="card col-md-12 form-container">
            <div className="card-body">
                <form onSubmit={onSubmitHandler}>
                    <div className="mb-3">
                        <label htmlFor="image" className='form-label'>
                            <img src={image?URL.createObjectURL(image):assets.upload} width={100}height={100}/>
                        </label>
                        <input type="file" name="image"
                        onChange={(e)=>setImage(e.target.files[0])}
                        className='form-control' id="image" 
                        hidden />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="name" className='form-label'>Name</label>
                        <input type='text'
                               name='name'
                               id='name'
                               className='form-control'
                               placeholder='Category Name'
                               onChange={onChangeHandler}
                               value={data.name}
                               required
                               />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className='form-label'>Description</label>
                        <textarea 
                              rows={5}
                               name='description'
                               id='description'
                               className='form-control'
                               placeholder='Write Content here'
                               onChange={onChangeHandler}
                               value={data.description}
                               ></textarea>
                               
                    </div>

                    <div className="mb-3">
                        <label htmlFor="bgcolor"  className='form-label'>Background color</label>
                        <br/>
                        <input 
                        type='color' 
                        name='bgColor' 
                        id='bgColor' 
                        placeholder='#ffffff'
                        onChange={onChangeHandler}
                        value={data.bgColor}
                        />
                    </div>

                    <button type="submit"
                     className='btn btn-warning w-100'
                      disabled={loading}>
                        {loading?"Loading...":"Save"}
                        </button>
                     

                </form>
            </div>
        </div>
    </div>
  </div>
  )
}

export default CategoryForm
