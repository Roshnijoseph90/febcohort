import React, { useEffect,useState } from 'react';
import useFetch from "../../hooks/useFetch";
import {axiosInstance} from '../../config/axiosInstance'
import { useSelector } from 'react-redux';
const Profile = () => {
  // Initialize state for profile data
  const [userProfile, isLoading, error] = useFetch("/user/profile");
  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  
  const user = useSelector((state) => state.user.user);
  const userId = user?._id;

  useEffect(() => {
    if (showOrders && userId) {
      axiosInstance
        .get(`/booking/user/${userId}`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error('Error fetching orders:', err));
    }
  }, [showOrders, userId]);

  
  return (
    <div>
      <div className='flex gap-8'>
        <button className='btn btn-primary'>Edit Profile</button>
        <button className='btn btn-secondary' onClick={() => setShowOrders(!showOrders)}>Your Bookings</button>
        <button className='btn btn-info'>Change Password</button>
        {/*button className='btn btn-neutral'>Logout</button*/}
      </div>
      
      <h5>Welcome: {userProfile?.name}</h5>
      <h5>Email ID:  {userProfile?.email}</h5>
      <h5>Location: {userProfile?.location}</h5>
      <h5>Mobile: {userProfile?.mobile}</h5>
      
      
      
      {/*showOrders && <p>This is your user orders</p>*/}
      {showOrders && (
        <div className="mt-4">
          <h3 className="text-xl font-bold mb-2">Your Bookings</h3>
          {orders.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order._id} className="p-4 border rounded-md">
                  <p><strong>Movie:</strong> {order.movieTitle}</p>
                  <p><strong>Theater:</strong> {order.theaterName}</p>
                  <p><strong>Showtime:</strong> {new Date(order.showTime).toLocaleString()}</p>
                  <p><strong>Seats:</strong> {order.seatNumber.join(', ')}</p>
                  <p><strong>Ticket Type:</strong> {order.ticketType}</p>
                  <p><strong>Premium:</strong> {order.isPremium ? 'Yes' : 'No'}</p>
                  <p><strong>Total Paid:</strong> ₹{order.totalAmount}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
