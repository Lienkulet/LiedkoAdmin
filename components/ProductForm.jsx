import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { HashLoader } from 'react-spinners';
import { ReactSortable } from 'react-sortablejs';
import Link from 'next/link';

const ProductForm = ({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
  properties:assignedProperties,
}) => {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [productProperties,setProductProperties] = useState(assignedProperties || {});
  const [category, setCategory] = useState(existingCategory || '');
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || '');
  const [categories, setCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    })
  }, []);

  const createProduct = async (e) => {
    e.preventDefault();

    const data = { 
      title, description, price, images, category, 
      properties: productProperties 
    }

    if (_id) {
      // Update Product
      await axios.put('/api/products', { ...data, _id });
      toast.success("Successfully updated!");
    } else {
      // Create Product
      await axios.post('/api/products', data);
      toast.success("Successfully created!");
    }
    setGoToProducts(true);
  }

  

  const uploadImages = async (e) => {
    const files = e.target?.files;

    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();

      for (const file of files) {
        data.append('file', file)
      };

      const res = await axios.post('/api/upload', data)
      setImages(oldImages => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }

  if (goToProducts) {
    router.push('/products');
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  const propertiesToFill = [];

  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while(catInfo?.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  const setProductProp = (propName, value) => {
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    })
  }

  return (
    <form onSubmit={e => createProduct(e)}>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder='Product Name'
      />
      <label>Category</label>
      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Uncategorized</option>
        {
          categories?.map(c => (
            <option value={c._id}>{c.name}</option>
          ))
        }
      </select>
      {propertiesToFill.length > 0 && propertiesToFill.map(p => (
        <div className='flex gap-1'>
          <div>{p.name}</div>
          <select 
          value={productProperties[p.name]}
          onChange={e => setProductProp(p.name, e.target.value)
          }>
            {p.values.map(v => (
              <option value={v}>{v}</option>
            ))}
          </select>
          </div>
      )
      )}
      <label>
        Photos
      </label>
      <div className='mb-2 flex flex-wrap gap-1'>
        <ReactSortable
          list={images}
          className='flex flex-wrap gap-1'
          setList={updateImagesOrder}>
          {!!images?.length && images.map(link => (
            <div key={link} className='h-24'>
              <img src={link} alt='' className='image rounded-lg' />
            </div>
          ))}
        </ReactSortable >
        {isUploading && (
          <div className='h-24 p-1 flex items-center'>
            <HashLoader color='#1E3A8A' speedMultiplier={2} />
          </div>
        )}
        <label className=' cursor-pointer w-24 h-24 text-center flex  text-sm gap-1
         text-gray-500 items-center justify-center rounded-lg bg-gray-200'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
          </svg>
          <div>
            Upload
          </div>
          <input type="file" onChange={e => uploadImages(e)} className='hidden' />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder='Description'
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder='Price'
        value={price}
        onChange={e => setPrice(e.target.value)}
      />
      <div className='flex flex-wrap gap-2'>
        <button
          type='submit'
          className='btn-primary hover:scale-90'>
          Save
        </button>
        {
          _id?
            <Link href='/products'>
              <button
                type='button'
                className='bg-red-800 py-1 px-2 rounded-md text-white hover:scale-90'>
                Cancel
              </button>
            </Link>
            :
            ' '
        }
      </div>
    </form>
  )
}

export default ProductForm