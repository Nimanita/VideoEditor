import axios from 'axios'
const MEDIAURL ='MEDIAURL'


function displayMediaUrl(response)
{
    
    return{
        type : MEDIAURL ,
        mediaUrl : response

    }
}


const Operations = (data) =>{
     console.log("inside operations" , data)
     switch(data.operation){
        case "changeMediaUrl" : return changeMediaUrl(data)
    }
}


const changeMediaUrl  = (data) =>{
    /* console.log(logindata);*/
    
    console.log("inside fetch data of media file")
    var config = {
    method: 'get',
    url: 'http://127.0.0.1:8000/video/media/' + data.fileName ,
    withCredentials : true,
   
    headers: { 
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8;application/json',
         "X-CSRFToken": data.csrftoken,
    }};
    console.log(config)
    const response =  axios.get(config['url'] , config ).then((res) => {
      console.log("res" , res["data"]["fileUrl"])
    
    });
       
   return function(dispatch){

        axios(config)
        .then(function (response) {
        
        console.log(response.data);
        dispatch(displayMediaUrl(response.data["fileUrl"]))
        })
        .catch(function (error) {
     
        console.log("error" , error);
        });
   }
}



export default Operations;

