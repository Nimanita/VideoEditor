import axios from "axios";

export function getCookie(name) {
    
        console.log("1")
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
          console.log("2")
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                console.log(i+3)
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

export const downloadFile  = (data) =>{
        /* console.log(logindata);*/
        
        console.log("inside fetch data of media file")
        var config = {
        method: 'get',
        url: 'http://127.0.0.1:8000/video/download/' + data.fileName ,
        withCredentials : true,
       
        headers: { 
            'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8;application/json',
             "X-CSRFToken": data.csrftoken,
        }};
        console.log(config)
        const response =  axios.get(config['url'] , config , { responseType: 'blob' } ).then((res) => {
          console.log("res" , res["data"]["fileUrl"])
        
        });
        axios(config)
            .then(function (response) {
            console.log(response)
            return response.data;
          
            })
            .catch(function (error) {
         
           
            });  
       
    }
    
    