import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ProgressBar,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import ReactPlayer from 'react-player';
import {useSelector , useDispatch } from 'react-redux';
import Operations from '../redux/action';
import { getCookie } from '../utils/generalFunction';


function VideoUploader() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [progress, setProgress] = useState();
  const [error, setError] = useState();


  var csrftoken = getCookie('csrftoken');
  
 
   
    const submitHandler = async(e) => {
    e.preventDefault(); //prevent the form from submitting
    let formData = new FormData();

    formData.append("File", selectedFiles[0]);
    //Clear the error message
    setError("");
   
    let fileName = selectedFiles[0]["name"];
    var progresspercentage
    await axios
      .post("http://127.0.0.1:8000/video/operation", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrftoken,
         
            },       
        onUploadProgress: (data) => {
          //Set the progress value to show the progress bar
          setProgress(Math.round((100 * data.loaded) / data.total));
          
        },
       
      })
      .catch((error) => {
        const { code } = error;
        switch (code) {
          case "FILE_MISSING":
            setError("Please select a file before uploading!");
            break;
          case "LIMIT_FILE_SIZE":
            setError("File size is too large. Please upload files below 1MB!");
            break;
          case "INVALID_TYPE":
            setError(
              "This file type is not supported! Only .mp4, .mp3 files are allowed"
            );
            break;

          default:
            console.log(error)
            setError("Sorry! Something went wrong. Please try again later");
            break;
        }
      }
      );
      
      var data = {
        'fileName' : fileName,
        'csrftoken' : csrftoken,
        'operation' : 'changeMediaUrl'
      }
      dispatch(Operations(data));
      
      
  };


  
  const dispatch = useDispatch()
  return (
    <Container>
      <Row>
        <Col lg={{ span: 4, offset: 3 }}>
        <Form
            action="http://127.0.0.1:8000/video/operation"
            method="post"
            encType="multipart/form-data"
            
            onSubmit={submitHandler}
          >
          <input type="hidden" name="csrfmiddlewaretoken" value={csrftoken} />
            <Form.Group controlId="formFile">
            
              <Form.Control type="file" name="file" placeholder="Large text" onChange={(e) => {e.preventDefault()
                  setSelectedFiles(e.target.files);
                }}>
                
                </Form.Control>
            </Form.Group>
            <Form.Group>
              <Button variant="info" type="submit">
                Upload
              </Button>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            {!error && progress && (
              <ProgressBar now={progress} label={`${progress}%`} class = "hidden"/>
            )}
          </Form>
        </Col>
      </Row>
      <Row>
      
      </Row>
    </Container>
  );
}

export default VideoUploader;