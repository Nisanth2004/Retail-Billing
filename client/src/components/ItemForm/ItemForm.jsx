import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { addItem } from '../../Service/ItemService';
import toast from 'react-hot-toast';

const ItemForm = () => {

   const{categories,setItemsData,itemsData,setCategories}= useContext(AppContext);

    const[image,setImage]=useState(false)
    const[loading,setLoading]=useState(false)
    const[data,setData]=useState({
        name:'',
        categoryId:'',
        price:' ',
        description:''
    })


    const onChangeHandler=(e)=>{
        const value=e.target.value;
        const name=e.target.name;
        setData((data)=>({...data,[name]:value}))
    }
    const onSubmitHandler=async(e)=>{
        e.preventDefault();

        setLoading(true);
        const formData=new FormData();
        formData.append("item",JSON.stringify(data));
        formData.append("file",image);

        try{
            if(!image)
            {
                toast.error("Please Select Image")
                return;
            }
           const response= await addItem(formData);
           if(response.status===201)
           {
            setItemsData([...itemsData,response.data])
            // TODO: upadated the category state
            setCategories((prevCategories)=>
            prevCategories.map((category)=>category.categoryId===data.categoryId?{...category,items:category.items + 1}: category)
            )
            toast.success("Item Added")
            setData({
                name:'',
                description:'',
                price:'',
                categoryId:''


            })
            setImage(false)

           }
           else{
            toast.error("Unable to add  item")
           }
        }
        catch(error)
        {
            toast.error("Unable to add  item")
            console.log(error)
        }
        setLoading(false)
    }

  return (
    <div className='item-form-container' style={{height:'100vh',overflowY:'auto',overflowX:'hidden'}}>
    <div className="mx-2 mt-2">
    <div className="row">
        <div className="card col-md-12 form-container">
            <div className="card-body">
                <form onSubmit={onSubmitHandler}>
                    <div className="mb-3">
                        <label htmlFor="image" className='form-label'>
                            <img src={image?URL.createObjectURL(image):assets.upload} width={100} height={100}/>
                        </label>
                        <input type="file" name="image" className='form-control'
                        onChange={(e)=>setImage(e.target.files[0])}

                        id="image" hidden />

                    </div>

                    <div className="mb-3">
                        <label htmlFor="name" className='form-label'>Name</label>
                        <input type='text'
                               name='name'
                               id='name'
                               className='form-control'
                               placeholder='Item Name'
                               onChange={onChangeHandler}
                               value={data.name}
                               required
                               />

                    </div>
                     <div className="mb-3">
                        <label htmlFor="category" required className="form-label">Category</label>
                        <select name="categoryId" id="category" className="form-control"
                        onChange={onChangeHandler}
                        value={data.categoryId}>
                            <option  value="">-- SELECT CATEGORY --</option>
                           { 
                            categories.map((category,index)=>(
                                <option key={index} value={category.categoryId}>{category.name}</option>
                            ))
                           }
                        </select>
                     </div>

                     <div className="mb-3">
                        <label htmlFor="price" required className='form-label'>Price</label>
                        <input type="number" name="price" id="price" 
                        className='form-control'
                        onChange={onChangeHandler}
                        value={data.price}
                        placeholder='&#8377;200' />
                     </div>
                    <div className="mb-3">
                        <label htmlFor="description"  className='form-label'>Description</label>
                        <textarea 
                              rows={5}
                               name='description'
                               id='description'
                               className='form-control'
                               placeholder='Write Content here...'
                               onChange={onChangeHandler}
                               value={data.description}
                               ></textarea>
                               
                    </div>

                  

                    <button type="submit" disabled={loading} className='btn btn-warning w-100'>{loading? "Loading...":"Save"}</button>
                     

                </form>
            </div>
        </div>
    </div>
  </div>
  </div>
  )
}

export default ItemForm
