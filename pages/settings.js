import { Layout } from '@/components'
import axios from 'axios'
import React, { use, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { HashLoader } from 'react-spinners';

const settings = () => {
  const [products, setProducts] = useState();
  const [loading, setLoading] = useState(false);
  const [featuredProductId, setFeaturedProductId] = useState(null);
  const [shippingFee, setShippingFee] = useState('');

  useEffect(() => {
    setLoading(true);
    
    fetchAll().then(() => {
      setLoading(false);
    });

}, [])
 
  const fetchAll = async () => {
    await axios.get('/api/products').then(response => {
      setProducts(response.data);
    });

    await axios.get('/api/featured?name=featuredProductId').then(response => {
      setFeaturedProductId(response.data.value);
    });

    await axios.get('/api/featured?name=shippingFee').then(response => {
      setShippingFee(response.data.value);
    });
  }

  const saveSettings = async () => {
    setLoading(true);
    await axios.put('/api/featured', {
      name: 'featuredProductId',
      value: featuredProductId,
    });

    await axios.put('/api/featured', {
      name: 'shippingFee',
      value: shippingFee,
    });      setLoading(false);
    
    toast.success("Successfully saved!")
    setLoading(false);
  }

  return (
    <Layout>
      <h1>Settings</h1>
      { loading  && (

          <div className='h-screen flex items-center justify-center ' >
            <HashLoader color='#1E3A8A' speedMultiplier={2} size={150} />
          </div>
       )}
       {!loading && (
        <>
          <label>Featured Product</label>
          <select
            value={featuredProductId} 
            onChange={e => setFeaturedProductId(e.target.value) }>
            {
              products?.length > 0 && products.map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))
            }
          </select>
          <label>Shipping price</label>
          <input type='number' 
            value={shippingFee}
            onChange={e => setShippingFee(e.target.value)} />
          </>
       )}
      
      <div>
        <button 
          onClick={saveSettings}
          className='btn-primary'>Save</button>
      </div> 
    </Layout>
  )
}

export default settings