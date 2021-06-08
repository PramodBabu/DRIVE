import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaFolderPlus, FaFileImport, FaFolder, FaImage } from 'react-icons/fa';
import Modal from 'react-modal';
import { creatFolder, getRootFolders, getFoldersByParent, changeFileAccess, changeFolderAccess} from '../../utils/folder';
import { uploadFile } from '../../utils/file';
import { toast } from 'react-toastify';
import * as actionTypes from '../../store/actionTypes';
import ModelComponent from './ModalComponent';

const DashBoard = () => {

    const dispatch = useDispatch();

    const [history, setHistory] = useState([]);
    const { user, folder } = useSelector(state => ({...state}));
    const [modal, setmodal] = useState(false);
    
    const [folderName, setFolderName] = useState('');
    const [parent, setParent] = useState(null);
    
    const [folders, setFolders] = useState([]);
    
    const [fileFlag, setFileFlag] = useState(false);

    const [file, setFile] = useState(null);

    const [files, setFiles] = useState([]);
    
    const [fileName, setFileName] = useState(null);

    useEffect(() => {
        getFolders(null);
        dispatch({
            type: actionTypes.UPDATE_ROOT_FOLDER,
            payload: null
        })
    },[]);

    const getFolders = (parent) => {
        if(!parent){
            getRootFolders(user.token)
                .then(res => {
                    setFolders(res.data.folders);
                    setFiles(res.data.files);
                    console.log(res.data);
                    dispatch({
                        type: actionTypes.UPDATE_ROOT_FOLDER,
                        payload: null
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            getFoldersByParent(user.token, parent)
                .then(res => {
                    setFolders(res.data.folders);
                    setFiles(res.data.files);
                    console.log(res.data);
                })
                .catch(err => {
                    console.log(err);
            });
        }
    }

    const handleFileSubmit = (e) => {
        e.preventDefault();
        const parent = folder ? folder._id : null;
        const formData = new FormData();
        formData.append(fileName, file);
        formData.append('parent', parent);
        formData.append('name', fileName);
        uploadFile(user.token, formData)
            .then(res => {
                setFile(null);
                setFileName(null);
                setParent(null);
                setmodal(false);
                setFileFlag(false);
            })
            .catch( err => {
                    console.log(err);
                }
            );
    }

    const handleFolderSubmit = () => {
        const parent = folder ? folder._id : null
        creatFolder(user.token, {name: folderName, parent })
            .then(res => {
                console.log(res);
                toast.success('folder created');
                setmodal(false);
                setFolderName('');
                getFolders(parent);
            })
            .catch(err => {
                console.log(err);
                setmodal(false);
            });
    }

    const differentClick = async (e, folderSelected) => {
        switch (e.which) {
            case 1:
                onFolderClicked(folderSelected);
                break;
            case 2:
                alert('Middle Mouse button pressed.');
                break;
            case 3:
                alert('Right Mouse button pressed.');
                break;
            default:
                onFolderClicked(folderSelected);
        }
    }

    const onFolderClicked = async (folderSelected) => {
        let newArr = [];
        if (folder) {
            newArr = [...folder.history , {rootFolder: folderSelected.name, _id: folderSelected._id }];
        } else {
            newArr = [{rootFolder: folderSelected.name, _id: folderSelected._id }];
        }
        dispatch({
            type: actionTypes.UPDATE_ROOT_FOLDER,
            payload: {
                rootFolder: folderSelected.name,
                _id: folderSelected._id,
                history: newArr
            }
        });
        getFolders(folderSelected ? folderSelected._id : null);
    }

    const handleFileModal = async () => {
        setmodal(true);
        setFileFlag(true);
    }

    const changeAccessFolder = async (e, access, id) => {
        e.stopPropagation();
        changeFolderAccess(user.token, access, id)
            .then(res => {
                console.log(res.data);
                toast.success('Access changed');
            })
            .catch(err => {
                console.log(err);
                toast.error('Something went wrong');
            });
    }

    const changeAccessFile = async (e, access, id) => {
        e.stopPropagation();
        changeFileAccess(user.token, access, id)
            .then(res => {
                console.log(res.data);
                toast.success('Access changed');
            })
            .catch(err => {
                console.log(err);
                toast.error('Something went wrong');
            });
    }

    const openFile = (item) => {
            window.open(`http://localhost:9000/${item.meta_data.path}`,'Image','width=largeImage.stylewidth,height=largeImage.style.height,resizable=1');
    }

    return (
        <>
            <div className="container mt-5" style={{height: '800px'}}>
                <div className="row">
                    {/* Action buttons */}
                    <div className="col-md-2 h-100" style={{ display: 'grid'}}>
                        <button type="button" onClick={() => setmodal(true)} className="btn btn-outline-primary">
                            <FaFolderPlus /> Create Folder
                        </button>
                        < br/>
                        <button type="button" className="btn btn-outline-success" onClick={handleFileModal}>
                            <FaFileImport /> Add File
                        </button>
                    </div>
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
                                        <div onClick={(e) => differentClick(e, item)} key={item._id} className="col-md-2 folder-hover">
                                            <button className="btn btn-sm-primary" onClick={e => changeAccessFolder(e, item.access === 'public' ? 'private' : 'public', item._id)}>Make {item.access === 'public' ? 'private' : 'public'}</button>
                                            <FaFolder style={{verticalAlign: 'baseline'}} size={50}/> <br />
                                            {item.name}
                                        </div>
                                    ))
                                ) : null }
                                {files && files.length > 0 ? (
                                    files.map(item => (
                                        <div onClick={() => openFile(item)} key={item._id} className="col-md-2 folder-hover">
                                            {/* <FaImage style={{verticalAlign: 'baseline'}} size={50}/> <br /> */}
                                            <button className="btn btn-sm-primary" onClick={e => changeAccessFile(e, item.access === 'public' ? 'private' : 'public', item._id)}>Make {item.access === 'public' ? 'private' : 'public'}</button>
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
            <ModelComponent 
                modal={modal}
                setmodal={setmodal}
                
                folderName={folderName}
                setFolderName={setFolderName}
                handleFolderSubmit={handleFolderSubmit}
                

                fileFlag={fileFlag}
                setFileFlag={setFileFlag}
                setFile={setFile}
                handleFileSubmit={handleFileSubmit}
                setFileName={setFileName}
            />
        </>
    );
}

export default DashBoard;