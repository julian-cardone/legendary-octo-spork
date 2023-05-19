import { useEffect } from "react";
import FileInput from "./FileInput";
import Preview from "./Preview";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoverLettersUploads } from "../../store/coverLetter";

function CoverLetterUploaded() {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user._id);
  const coverLetters = useSelector((state) =>console.log(state))

  //fetch uploaded cls based on userid

  //testing
  // let binaryData = atob(base64Data);

  //downloads correctly, just doesn't display correctly
  //   var link = document.createElement('a');
  // link.innerHTML = 'Download PDF file';
  // link.download = 'file.pdf';
  // link.href = 'data:application/octet-stream;base64,' + base64Data;
  // document.body.appendChild(link);

  //WORKING:
  // var obj = document.createElement('object');
  // obj.style.width = '100%';
  // obj.style.height = '842pt';
  // obj.type = 'application/pdf';
  // obj.data = 'data:application/pdf;base64,' + base64Data;
  // document.body.appendChild(obj);

  useEffect(()=>{
    dispatch(fetchCoverLettersUploads(user))
  },[user])   //memoize or ref?? 

  return (
    //specify in routes
    <>
      <>
        <div className="container-lg my-5 pt-5">
          <div className="row mx-5 justify-content-between">
            <div className="col-sm-6 col-md-6 col-lg-4">
              <FileInput user={user}></FileInput>
              <p>loading symbol... selected CL: example.pdf</p>
            </div>
            <div id="preview" className="col-sm-7 col-md-5 col-lg-7">
              <div className="p-5 bg-primary">Preview
                <Preview></Preview>
              </div>
            </div>
          </div>
          <div className="row mx-5">
            <div className="col-sm-6 col-md-6 col-lg-4"></div>
          </div>
          <div className="row mx-5">
            <div className="mt-5 col-sm-6 col-md-6 col-lg-4">
              {/* <div className="p-5 bg-primary"></div> */}
              
            </div>
          </div>
          {/* <a innerHTML="Download for pdf" download=""></a> */}
        </div>
      </>
    </>
  );
}

export default CoverLetterUploaded;