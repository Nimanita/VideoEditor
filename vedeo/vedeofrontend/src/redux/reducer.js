

const rrr = require('react-router-redux');
const push = rrr.push()

const MEDIAURL ='MEDIAURL'
const initialState = {

    mediaUrl : ""

}
const appreducer = (state = initialState,action)=>{
switch(action.type){

  case MEDIAURL :return{
    ...state ,
    mediaUrl : action.mediaUrl
  }
  
  
  default : return state
}

}

export default appreducer