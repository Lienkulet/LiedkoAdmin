import React, { useEffect, useState } from 'react'
import { Layout } from '@/components'
import axios from 'axios'
import { HashLoader } from 'react-spinners';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('api/orders').then(response => {
      setOrders(response.data);
      setLoading(false);
    });
  }, [])

  return (
    <Layout>
      <h1>Orders</h1>
      <table className='basic'>
        <thead>
          <tr>
            <td>Date</td>
            <td>Recipient</td>
            <td>Products</td>
            <td>Total(USD)</td>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 && orders.map(order => (
            <tr key={order._id}>
              <td>{(new Date(order.createdAt)).toLocaleString()}</td>
              <td>
                {order.name} {order.email}<br />
                {order.city} {order.postalCode} {order.country}<br />
                {order.streetAddress}
              </td>
              <td>
                {order?.line_items?.map(l => (
                  <div key={l.price_data.product_data.name}>
                    {l.price_data.product_data.name} x {l.quantity}<br />
                  </div>
                ))}
              </td>
              <td>{order.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {
        loading && (

          <div className='h-screen flex items-center justify-center ' >
            <HashLoader color='#1E3A8A' speedMultiplier={2} size={150} />
          </div>
        )
      }
    </Layout>
  )
}

export default Orders