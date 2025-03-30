
import { useState ,useEffect} from 'react';
import {axiosInstance} from '../config/axiosInstance'
 const useFetch = (url) => {
  const [data, setData ]= useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error,setError] = useState(null)
    const fetchData = async () => {
      try {
        const response = await axiosInstance({
          method: 'GET',
          url:url,
        });
  
        // Set movie data
        setData(response?.data?.data);
  
        // Set loading state to false after fetching data
        setTimeout(() => {
          setIsLoading(false); // Correctly call setIsLoading(false)
        }, 1000);
      } catch (error) {
        console.log(error);
        setError(error)
  
        // In case of an error, set loading to false
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, [url]);
    return[data,isLoading,error]
}
export default useFetch
