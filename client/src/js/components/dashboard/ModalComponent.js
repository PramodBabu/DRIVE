import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

const ModelComponent = (props) => {
    
    const {modal, setmodal, folderName, setFolderName, handleFolderSubmit, fileFlag, setFileFlag, setFile, handleFileSubmit, setFileName} = props;

    return (
        <Modal
                isOpen={modal}
                onRequestClose={() => {setmodal(false); setFileFlag(false)}}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Example Modal"
                >
                    {
                        !fileFlag ? (
                            <>
                                <div className="container">
                                    <input type="text" className="form-control" value={folderName} onChange={e => setFolderName(e.target.value)}></input>
                                    <button className="btn btn-outline-info" onClick={handleFolderSubmit}>submit</button>
                                    <button className="btn btn-outline-danger" onClick={() => {setmodal(false); setFileFlag(false);}}>cancel</button>
                                </div>
                            </>
                        ) :  (
                            <form onSubmit={handleFileSubmit} >
                                <div className="form-group">
                                    <h4>File Upload</h4>
                                    <input type="text" className="form-control" onChange={e => setFileName(e.target.value)}></input>
                                    <input type="file" className="form-control" name="myImage" onChange={(e) => setFile(e.target.files[0])} />
                                    <button className="btn btn-outline-info" type="submit">Upload to DB</button>
                                    <button className="btn btn-outline-danger" onClick={() => {setmodal(false); setFileFlag(false);}}>cancel</button>  
                                </div>    
                            </form>
                    )} 
        </Modal> 
    );
}

export default ModelComponent;