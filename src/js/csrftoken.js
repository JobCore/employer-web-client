import React, { useState, useEffect } from 'react';
import { GET } from './utils/api_wrapper';
import Cookies from 'js-cookie'


const CSRFToken = () => {
    const [csrftoken, setcsrftoken] = useState('');
    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                console.log("cookie", cookie)
                Cookies.set('csrftoken', cookie)
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    
                    break;
                }
            }
        }
        // console.log(thiscookieValue)
        return cookieValue;
    }
    useEffect(() => {
        
        // const fetchData = async () => {
        //     try {
        //         let cookieCsrf = await  GET('csrf_cookie');
        //         console.log("este es el cookieCsrf" , cookieCsrf)
        //     //    console.log("cookieCsrf###", cookieCsrf)
        //     } catch (err) {

        //     }
        // };

        // fetchData();
        // CSRFToken()
        
        setcsrftoken(Cookies.get('csrftoken'));
        //console.log("este es el useeffect")
    }, []);
    

    return (
        <input type='hidden' name='csrfmiddlewaretoken' value={csrftoken} />
        // <input type='hidden' name='csrfmiddlewaretoken' />
    );
};

export default CSRFToken;