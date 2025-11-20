import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setOtherUsers } from '../redux/userSlice';
import { BASE_URL } from '../main';

const useGetOtherUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
      const fetchOtherUsers = async () => {
          try {
              axios.defaults.withCredentials = true;
              const res = await axios.get(`${BASE_URL}/api/v1/user`);
              dispatch(setOtherUsers(res.data || []));
          } catch (error) {
              console.error("Failed to fetch users:", error);
              dispatch(setOtherUsers([]));
          }
      }
      fetchOtherUsers();
  }, [dispatch])

}

export default useGetOtherUsers;