import axios from 'axios'
import { subHours } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { HashLoader } from 'react-spinners';

const HomeStats = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get('/api/orders').then(res => {
            setOrders(res.data);
            setLoading(false);
        })
    }, [])


    if(loading){
        return (
          <div className='h-screen flex items-center justify-center ' >
            <HashLoader color='#1E3A8A' speedMultiplier={2} size={150} />
          </div>
        )
    }

    const ordersToday = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24));
    const ordersWeek = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24*7));
    const ordersMonth = orders.filter(o => new Date(o.createdAt) > subHours(new Date, 24*30));

    const ordersTotal = (orders) => {
        let total = 0;
         orders.map(o => {
            total += o.total;
         });

        return new Intl.NumberFormat('en-US').format(total);
    }

    return (
        <div>
            <h2>Orders</h2>
            <div className='tiles-grid'>
                <div className='tile'>
                    <h3 className='tile-header'>Today</h3>
                    <div className='tile-number'>{ordersToday.length}</div>
                    <div className='tile-desc'>{ordersToday.length} orders today</div>
                </div>
                <div className='tile'>
                    <h3 className='tile-header'>This Week</h3>
                    <div className='tile-number'>{ordersWeek.length}</div>
                    <div className='tile-desc'>{ordersWeek.length} orders this week</div>
                </div>
                <div className='tile'>
                    <h3 className='tile-header'>This Month</h3>
                    <div className='tile-number'>{ordersMonth.length}</div>
                    <div className='tile-desc'>{ordersMonth.length} orders this month</div>
                </div>
            </div>
            <h2>Revenue</h2>
            <div className='tiles-grid'>
                <div className='tile'>
                    <h3 className='tile-header'>Today</h3>
                    <div className='tile-number'>${ordersTotal(ordersToday)}</div>
                    <div className='tile-desc'>{ordersToday.length} orders today</div>
                </div>
                <div className='tile'>
                    <h3 className='tile-header'>This Week</h3>
                    <div className='tile-number'>${ordersTotal(ordersWeek)}</div>
                    <div className='tile-desc'>{ordersWeek.length} orders this week</div>
                </div>
                <div className='tile'>
                    <h3 className='tile-header'>This Month</h3>
                    <div className='tile-number'>${ordersTotal(ordersMonth)}</div>
                    <div className='tile-desc'>{ordersMonth.length} orders this month</div>
                </div>
            </div>
        </div>
    )
}

export default HomeStats