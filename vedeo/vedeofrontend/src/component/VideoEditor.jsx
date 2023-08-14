import React, { useState , useRef } from 'react';
import ReactPlayer from 'react-player';
import {useSelector , useDispatch } from 'react-redux';
import Alert from "react-bootstrap/Alert";
import "./style.css";
import axios from "axios";
import { getCookie , downloadFile} from '../utils/generalFunction';
import Operations from '../redux/action';


function VideoEditor() {
  const [subtitles, setSubtitles] = useState([]);
  const [timestamp, setTimestamp] = useState({
    id : 0,
    start : "00:00:00",
    end : "00:00:00"
  });
  const [subtitleText, setSubtitleText] = useState('');
  const [alert, showAlert] = useState(true);
  const timeFormatRegex = /^(?:[0-5][0-9]):(?:[0-5][0-9]):(?:[0-9]{2})$/; 
  const playerRef = useRef(null);
  
 
  const handleAddSubtitle = () => {
    var starttime = timestamp.start 
    var endtime = timestamp.end 
    var flag = 0
    
    console.log(flag , "flag")
    const updatedItems = subtitles.map(item => {
      if (item.timestamp.start === starttime && item.timestamp.end === endtime) {
        flag = 1
        return { ...item, subtitleText: subtitleText };
      }
      return item;
    });
     
    console.log(flag , "flag" , updatedItems , "updatedItems")
    if (subtitleText) {
       
      if (flag === 0){
        const newSubtitle = { timestamp, subtitleText };
        setSubtitles([...subtitles, newSubtitle]);
      }
      else
      {
        setSubtitles(updatedItems)
      }
 
    }
    
  };

  const handleTimeStamp = (e)=> {
     
    let isValid = timeFormatRegex.test(e.target.value)
    console.log(isValid , "testresult")
    var starttime , endtime , isDuplicate
    if(isValid){
      showAlert(true)
      var id = subtitles.length
      console.log("id" , id)
      if(e.target.id === "starttime")
      {  
           starttime = e.target.value
           endtime = timestamp.end
           id = id
      }
      else
      {
        endtime = e.target.value
        starttime = timestamp.start
        id = id 
      }
     
    
      setTimestamp({
          ...timestamp,
          start : starttime,
          end : endtime
      })
      
    }
    else{
      console.log("invalid")
      showAlert(false)
    }

  };
 
  var csrftoken = getCookie('csrftoken');

  const generateSRT = () => {
    let srtContent = '';
    subtitles.forEach((subtitle, index) => {

      const startTime = subtitle.timestamp.start + ',000';
      const endTime = subtitle.timestamp.end + ',000' ;
      
      srtContent += `${index + 1}\n${startTime} --> ${endTime}\n${subtitle.subtitleText}\n\n`;
    });
    return srtContent;
  };

  const addSubtitleToVideo = () => {
    // Generate SRT content
    const srtContent = generateSRT()
    const blob = new Blob([srtContent], { type: 'text/plain' });

    // Send the Blob to the backend
    sendBlobToBackend(blob);
  };

  const sendBlobToBackend = async (blob) => {
  let formData = new FormData();

  const filename = 'subtitle.srt';
  formData.append("File", blob , filename);
  var response = await axios
      .post("http://127.0.0.1:8000/video/subtitle", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrftoken,
         
            },
      
      })
      .catch((error) => {
          console.log(error)
        })
       
        console.log("RESPONSE JSON" , response)
        if (response.status === 200){
          console.log(response)
          var data = {
            'fileName' : response.data["fileUrl"],
            'csrftoken' : csrftoken,
            'operation' : 'changeMediaUrl'
          }
          dispatch(Operations(data));
        }
    }
  
  const dispatch = useDispatch()
  
  
  //CODE FOR PAGINATION SUPPORT//
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(subtitles.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalDisplayedPages = 5; // Number of page numbers to display
    const halfDisplayCount = Math.floor(totalDisplayedPages / 2);
    let startPage = Math.max(1, currentPage - halfDisplayCount);
    let endPage = Math.min(totalPages, startPage + totalDisplayedPages - 1);

    if (endPage - startPage < totalDisplayedPages - 1) {
      startPage = Math.max(1, endPage - totalDisplayedPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={currentPage === i ? 'active' : ''}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentData = subtitles.slice(firstIndex, lastIndex);

  //CODE FOR PAGINATION SUPPORT//

  const convertTimeToSeconds = (timeString) => {
    const [minutes, seconds] = timeString.split(':').map(parseFloat);
    return minutes * 60 + seconds;
  };
  
  const handleDownload = async () => {
    try {
      if (mediaUrl) {
        const filename = mediaUrl.substring(mediaUrl.lastIndexOf("/") + 1);
       
        var data = {
          "fileName" : filename,
          "X-CSRFToken": csrftoken,

        }
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
            
            console.log("responsetype" , typeof(response.data))
            const blob = new Blob([response.data , { type: 'video/mp4' }]);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename; // Set the desired download filename
            a.click();
    
            URL.revokeObjectURL(url);
          });
          axios(config)
              .then(function (response) {
              console.log(response)
              return response.data;
            
              })
              .catch(function (error) {
           
             
              });  
       
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  
  /*const handleProgress = (progress) => {
    const currentTime = progress.playedSeconds;
    const matchingSubtitle = subtitles.find(
      (subtitle) =>
        currentTime >=  convertTimeToSeconds(subtitle.timestamp.start) &&
        currentTime <= convertTimeToSeconds(subtitle.timestamp.end)
    );
    setCurrentSubtitle(matchingSubtitle ? matchingSubtitle.text : null);
  };*/
  var mediaUrl = useSelector(state=>state.mediaUrl);
  console.log(mediaUrl , "mediaurl")
  if(mediaUrl.length>0)
  {
      return (
        <div >
        <h1>Subtitle Editor</h1>
       
        <ReactPlayer url= {mediaUrl}   controls 
          playing
          ref={playerRef}
         
         
        />
       
        
        <div class = "row">
        <div class = "col-lg-2">
        <div class = "row">
        
      <input
        type="text"
            placeholder = "00:00:00"
            id ="starttime"
            onChange={(e) => handleTimeStamp(e)}     />
     </div>
      <div class = "row">
      
      <input
        type="text"
            placeholder="00:00:00"
            id ="endtime"
            onChange={(e) => handleTimeStamp(e)}     />
</div>
      </div>
      <div class = "col-lg-10">
          <textarea
            placeholder="Subtitle text"
            value={subtitleText}
            onChange={(e) => setSubtitleText(e.target.value)} 
          />
        </div>  
          <button onClick={handleAddSubtitle}>Save Subtitle</button>
          <button onClick={addSubtitleToVideo}>Add Subtitle To Video</button>
          <button onClick={() => {
            const srtContent = generateSRT();
            const blob = new Blob([srtContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'subtitles.srt';
            a.click();
            URL.revokeObjectURL(url);
          }}>Download .SRT</button>
        </div>
        
        <div>
      
      {subtitles.length > 0 ? (
        <div>
        <h1>SUBTITLES</h1>
          <table>
            {/* ...table headers... */}
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index}>
                <td>{item.timestamp.start}</td>
                <td>{item.timestamp.end}</td>
                <td>{item.subtitleText}</td>
                {/* Add more cells for other properties */}
              </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {currentPage > 1 && (
              <button onClick={() => handlePageChange(currentPage - 1)}>&lt;</button>
            )}
            {renderPageNumbers()}
            {currentPage < totalPages && (
              <button onClick={() => handlePageChange(currentPage + 1)}>&gt;</button>
            )}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
        <Alert variant="danger" className={alert ? "hideelement" : "alert alert-danger show"} style={{ width: "42rem" }}>
        <Alert.Heading  >
          Invalid timestamp 
        </Alert.Heading>
      </Alert>

      </div>
      );
  }
  else
  {
    return(
      <div></div>
    )
  }
}

export default VideoEditor;




