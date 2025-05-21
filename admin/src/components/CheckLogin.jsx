import { allContext } from '../context/Context';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
export default function CheckLogin() {
     const { checkLogin } = useContext(allContext)
     const navigate = useNavigate()



     useEffect(() => {
          if (!checkLogin) {

               setTimeout(() => {
                    navigate('/');
               }, 1000);

          }
     }, [checkLogin, navigate]);

     return null
}
