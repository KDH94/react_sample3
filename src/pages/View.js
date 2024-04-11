import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import './View.css';
import { Carousel, Modal } from 'react-bootstrap';

export default function View() {
    const { boardNo } = useParams();
    const [userId, setUserId] = useState("");
    const [writerId, setWriterId] = useState("");
    const [board, setBoard] = useState({});
    const [imageList, setimageList] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    useEffect(() => {
        const sessionUserId = sessionStorage.getItem("userId");
        if (sessionUserId !== null || sessionUserId !== 'undefined') {
            setUserId(sessionUserId);
        }
        async function fetchBoardView() {
            try {
                const response = await fetch(`http://localhost:4000/snsBoardView.dox?boardNo=${boardNo}`);
                const jsonData = await response.json();
                setWriterId(jsonData.userId);
                setBoard(jsonData);
            } catch (error) {
                console.log("boardView error:", error);
            }
        }
        async function fetchImagesView() {
            try {
                const response = await fetch(`http://localhost:4000/snsImagesView.dox?boardNo=${boardNo}`);
                const jsonData = await response.json();
                setimageList(jsonData);
            } catch (error) {
                console.log("imageView error:", error);
            }
        }
        fetchBoardView();
        fetchImagesView();
    }, [boardNo])

    const onUpdateBtn = () => setIsUpdate(true);
    const onCancelBtn = async () => {
        setIsUpdate(false);
        try {
            const response = await fetch(`http://localhost:4000/snsBoardView.dox?boardNo=${boardNo}`);
            const jsonData = await response.json();
            setBoard(jsonData);
            const response2 = await fetch(`http://localhost:4000/snsImagesView.dox?boardNo=${boardNo}`);
            const jsonData2 = await response2.json();
            setimageList(jsonData2);
        } catch (error) {
            console.log("editing cancel error:", error);
        }
    };

    const onUpdatePost = async () => {
        try {
            const map = {};
            map.boardNo = board.boardNo;
            map.title = board.title;
            map.content = board.content;
            map.image = selectedFiles;

            const now = new Date();
            const year = now.getFullYear().toString().slice(-2);
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');

            const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
            let files = [];
            for (const file of selectedFiles) {
                const fileName = `${timestamp}_${file.name}`;
                files.push({ fileName: fileName, fileOrgName: file.name });
                const imgformData = new FormData();
                imgformData.append('file', file, fileName);
                try {
                    const response = await fetch('http://localhost:4000/upload', {
                        method: 'POST',
                        body: imgformData
                    });

                    if (!response.ok) {
                        throw new Error('이미지 업로드에 실패했습니다.');
                    }

                    await response.json();
                } catch (error) {
                    console.error('이미지 업로드 오류:', error.message);
                }
            }
            map.files = files;
            const response = await fetch(`http://localhost:4000/snsBoardEdit.dox`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(map)
            });

            await response.json();
            onCancelBtn();
        } catch (error) {
            console.log("boardEdit error:", error);
        }
    }

    const onDeletePost = async () => {
        try {
            if (window.confirm("정말 삭제할까요?")) {
                const response = await fetch(`http://localhost:4000/snsBoardRemove.dox?boardNo=${boardNo}`);
                await response.json();
                window.location.href = "http://localhost:3000/profile";
            }
        } catch (error) {
            console.log("boardEdit error:", error);
        }
    }

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 3) {
            // 4개 이상의 파일이 선택된 경우
            alert('최대 3개까지 파일을 업로드할 수 있습니다!');
            // 파일 선택을 초기화
            e.target.value = null;
            // 선택된 파일과 미리보기를 초기화
            setSelectedFiles([]);
            setPreviewImages([]);
            return;
        }

        const selectedFilesUrls = files.map(file => URL.createObjectURL(file)); // 선택한 파일들의 미리보기 생성

        setSelectedFiles(files);
        setPreviewImages(selectedFilesUrls);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBoard(prevBoard => ({ ...prevBoard, [name]: value }));
    }

    const openModal = (imageUrl) => {
        setModalImage(imageUrl);
        setModalShow(true);
    }

    const closeModal = () => {
        setModalShow(false);
        setTimeout(()=>{
            setModalImage(null);
        }, 100);
    }

    //console.log("이미지리스트===>", imageList);
    return (
        <div className="view-container">
            <div className="post">
                <div className="post-header">
                    <p className="username">{board.userId}</p>
                    <p className="posted-time">{board.cdate}</p>
                </div>
                <div className="post-content">
                    {!isUpdate ? <h2 className="post-title">{board.title}</h2> : <input className="view-input" name="title" value={board.title} onChange={handleChange} placeholder="제목 작성" />}
                    {!isUpdate ? <div className="image-carousel">
                        {imageList.length > 0 && (
                            <Carousel fade>
                                {imageList.map((image, index) => (
                                    <Carousel.Item key={index}>
                                        <div className="image-container" onClick={() => openModal(`http://localhost:4000/` + image.filePath + image.fileName)} style={{ cursor: "zoom-in" }}>
                                            <img
                                                className="d-block w-100"
                                                src={`http://localhost:4000/` + image.filePath + image.fileName}
                                                alt={`Slide ${index}`}
                                            />
                                        </div>
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        )}
                    </div> :
                        <div>
                            <input type="file" accept="image/*" multiple onChange={handleFileUpload} />
                            {previewImages.map((image, index) => (
                                <img key={index} src={image} alt={`Uploaded ${index}`} style={{ width: '140px', height: '140px', marginRight: '10px', marginBottom: '5px' }} />
                            ))}
                        </div>
                    }
                    {!isUpdate ? <p className="content-text">{board.content}</p> : <textarea className="view-input" name="content" value={board.content} onChange={handleChange} placeholder="내용 작성"></textarea>}
                </div>
                {userId === writerId && <div>
                    {!isUpdate ?
                        <div>
                            <button className="update-btn delete-btn" onClick={onDeletePost}>삭제</button>
                            <button className="update-btn" onClick={onUpdateBtn}>수정</button>
                        </div>
                        :
                        <div>
                            <button className="update-btn cancel-btn" onClick={onCancelBtn}>취소</button>
                            <button className="update-btn" onClick={onUpdatePost}>확인</button>
                        </div>}
                </div>}
            </div>
            <Modal show={modalShow} onHide={closeModal}>
                <Modal.Body>
                    <div className="d-flex align-items-center justify-content-center">
                        <img src={modalImage} alt="모달창" className="img-fluid" />
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}