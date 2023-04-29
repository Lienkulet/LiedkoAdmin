import { Layout } from '@/components'
import axios from 'axios';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const DeleteProduct = () => {

  const router = useRouter();
  const { id } = router.query;
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    axios.get(`/api/products?id=${id}`).then(response => {
      setProductInfo(response.data);
    });
  }, [id]);

  const deleteProduct = async () => {
    await axios.delete(`/api/products?id=${id}`);
    router.push('/products');
  }

  return (
      <Layout>
      <h1 className='text-center'>
          Do you really want to delete "{productInfo?.title} "?
        </h1><div className='flex gap-2 justify-center'>
            <button className='btn-red' onClick={() => deleteProduct()}>Yes</button>
            <button className='btn-default'
              onClick={() => router.push('/products')}>No</button>
          </div>
    </Layout>
  )
}

export default DeleteProduct