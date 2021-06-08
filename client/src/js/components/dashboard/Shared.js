import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { FaFolderPlus, FaFileImport, FaFolder, FaImage } from 'react-icons/fa';
import { getShared} from '../../utils/folder';
import { toast } from 'react-toastify';
import * as actionTypes from '../../store/actionTypes';

const Shared = () => {

    const { user, folder } = useSelector(state => ({...state}));
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);


    useEffect(() => {
        getFolders();
    }, []);

    const getFolders = (parent) => {
        getShared(user.token)
            .then( res => {
                setFiles(res.data.files);
                setFolders(res.data.folders);
            })
            .catch( err => {

            });
    }

    const onFolderClicked = async (folderSelected) => {
        let newArr = [];
        if (folder) {
            newArr = [...folder.history , {rootFolder: folderSelected.name, _id: folderSelected._id }];
        } else {
            newArr = [{rootFolder: folderSelected.name, _id: folderSelected._id }];
        }
        // getFolders(folderSelected ? folderSelected._id : null);
    }

    const openFile = (item) => {
        window.open(`http://localhost:9000/${item.meta_data.path}`,'Image','width=largeImage.stylewidth,height=largeImage.style.height,resizable=1');
    }

    return (
        <>
            <div className="container mt-5" style={{height: '800px'}}>
                <div className="row">
                    <div className="col-md-10 h-100 d-flex flex-start">
                        <div className="container">
                            {/* Navigation */}
                            <div className="row">
                                <div style={{marginLeft: '10px', color: 'blueviolet'}} onClick={() => getFolders(null)}>{'root /'}</div>
                                {folder && folder.history.length > 0 && folder.history.map(item => (
                                    <div key={item._id} style={{marginLeft: '10px', color: 'blueviolet', cursor: 'pointer'}}>
                                        {item.rootFolder + '/'}
                                    </div>
                                ))}
                            </div>
                            {/* folder directory  */}
                            <div className="row mt-3">
                                {folders && folders.length > 0 ? (
                                    folders.map(item => (
                                        <div onClick={() => onFolderClicked(item)} key={item._id} className="col-md-2 folder-hover">
                                            <FaFolder style={{verticalAlign: 'baseline'}} size={50}/> <br />
                                            {item.name}
                                        </div>
                                    ))
                                ) : null }
                                {files && files.length > 0 ? (
                                    files.map(item => (
                                        <div onClick={() => openFile(item)} key={item._id} className="col-md-2 folder-hover">
                                            {/* <FaImage style={{verticalAlign: 'baseline'}} size={50}/> <br /> */}
                                            <img class="rounded mx-auto d-block" src={`http://localhost:9000/${item.meta_data.path}`} style={{ width: '50px', height: '50px'}} alt="sub"/>
                                            {item.name}
                                        </div>
                                    ))
                                ) : null }
                                {files && files.length === 0 && folders.length === 0 && <span> {'No files or folders'} </span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Shared;