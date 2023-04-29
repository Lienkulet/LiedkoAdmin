import { Layout } from '@/components'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { HashLoader } from 'react-spinners';

const Categories = () => {
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDelete, setIsDelete] = useState(false);
    const [deletedCategory, setDeletedCategory] = useState('');
    const [editedCategory, setEditedCategory] = useState(null);
    const [parentCategory, setParentCategory] = useState('');
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        setLoading(true);
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
            setLoading(false);
        });
    }

    async function saveCategory(ev){
        ev.preventDefault();
        const data = { 
            name,
            parentCategory,
            properties: properties.map(p => ({
                name: p.name,
                values: p.values.split(',')
            }))
        };

        if (editedCategory) {
          data._id = editedCategory._id;

          if(parentCategory === ''){
            data.parentCategory = null;
          }

          await axios.put('/api/categories', data);
          setEditedCategory(null);
        } else {
            if(parentCategory === ''){
                data.parentCategory = null;
            }

          await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('');
        setProperties('');
        fetchCategories();
        toast.success("Successfully saved!");
      }

    const editCategory = (category) => {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({name, values}) => ({
                name,
                values: values.join(',')
            }))
            );
        toast.success("Successfully edited!");
    }

    const deleteCategory = async (id) => {
        await axios.delete(`/api/categories?id=${id}`);
        setIsDelete(false);
        toast.success("Successfully deleted!");
        fetchCategories();
    }

    const addProperty = () => {
        setProperties(prev => {
            return [...prev, {
                name: '',
                values: ''
            }]
        })
    }

    const handlePropertyNameChange = (index, property, newName) => {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties
        })
    }

    const handleValuesChange = (index, property, newValues) => {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties
        })
    }

    const removeProperty = (index) => {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== index;
            });
        })
    }


    return (
        <Layout>
            {
                isDelete ?
                    (
                        <div className='fixed top-0 right-0 w-screen h-screen bg-black bg-opacity-20 backdrop-filter-3
                         backdrop-blur-sm z-50 transition duration-100 ease-in-out flex justify-center'>
                            <div className='delete top-60 rounded-lg'>
                                <h1 className='text-center'>
                                    Do you really want to delete `{deletedCategory.name}`?
                                </h1>
                                <div className='flex gap-2 justify-center'>
                                    <button className='btn-red'
                                        onClick={() => deleteCategory(deletedCategory._id)}
                                    >Yes</button>
                                    <button className='btn-default'
                                        onClick={() => setIsDelete(false)}
                                    >No</button>
                                </div>
                            </div>
                        </div>
                    )
                    :
                    ''
            }
            <h1>Categories</h1>
            <label>
                {editedCategory ?
                    `Edit Category ${editedCategory.name}`
                    :
                    'Create New Category'}
            </label>
            <form onSubmit={e => saveCategory(e)} >
                <div className='flex gap-1'>
                    <input
                        type='text'
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder='Category name' />
                    <select
                        value={parentCategory}
                        onChange={e => setParentCategory(e.target.value)}>
                        <option value=''>No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option key={category._id} value={category._id}>{category.name}</option>
                        ))}

                    </select>
                </div>
                <div className='mb-2'>
                    <label className='block'>Properties</label>
                    <button
                        type='button'
                        onClick={() => addProperty()}
                        className='btn-default text-sm mb-1'>Add new property</button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div  className='flex gap-1'>
                            <input
                                type="text"
                                value={property.name}
                                className='mb-0'
                                onChange={e => handlePropertyNameChange(index, property, e.target.value)}
                                placeholder='Property name (example: color)'
                            />
                            <input
                                type="text"
                                value={property.values}
                                className='mb-0'
                                onChange={e => handleValuesChange(index, property, e.target.value)}
                                placeholder='Values, coma separated'
                            />
                            <button
                                type='button'
                                className='bg-red-800 text-white text-sm
                             p-1 px-2 rounded-md inline-flex gap-1 mr-1 
                             items-center'
                                onClick={() => removeProperty(index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className='flex flex-wrap gap-1'>
                    <button type='submit' className='btn-primary py-1'>Save</button>
                    
                    {editedCategory && (
                        <button
                        type='button'
                        className='bg-red-800 text-white text-sm
                          p-1 px-3 rounded-md inline-flex gap-1 mr-1 items-center'
                        onClick={() => {
                            setEditedCategory(null);
                            setName('');
                            setParentCategory('');
                            setProperties([]);
                        }
                        } 
                    >
                        Cancel
                    </button>
                    )}
                    
                </div>
            </form>
            {!editedCategory && (
                <table className='basic mt-4'>
                    <thead>
                        <tr>
                            <td>Category Name</td>
                            <td>Parent Category </td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loading ?
                                <tr></tr>
                                :
                                categories?.map(category => (
                                    <tr key={category._id}>
                                        <td>{category.name}</td>
                                        <td>{category?.parent?.name}</td>
                                        <td className='flex flex-wrap gap-1'>

                                            <button
                                                onClick={() => editCategory(category)}
                                                className='bg-blue-900 text-white text-sm p-1 px-2 rounded-md inline-flex gap-1 mr-1 items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                                <h5 className='pr-4'>
                                                    Edit
                                                </h5>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeletedCategory(category);
                                                    setIsDelete(true);
                                                }}
                                                className='bg-red-800 text-white text-sm p-1 px-2 rounded-md inline-flex gap-1 mr-1 items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            )}

            {
                loading ?
                    <div className='h-screen flex items-center justify-center ' >
                        <HashLoader color='#1E3A8A' speedMultiplier={2} size={150} />
                    </div>
                    :
                    ''
            }
        </Layout>
    )
}

export default Categories