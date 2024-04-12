// import Menu from '../components/Menu';
import React, { useState, useEffect } from 'react';
import './Home.css';
import { Carousel, Modal, Collapse } from 'react-bootstrap';
import { ReactComponent as LikeEmptyIcon } from '../assets/likeE-icon.svg';
import { ReactComponent as LikeFilledIcon } from '../assets/likeF-icon.svg';
import { ReactComponent as CommentIcon } from '../assets/comment_icon.svg';
import { ReactComponent as DmIcon } from '../assets/dm-icon.svg';

function Home() {
    const [boardList, setBoardList] = useState([]);
    const [imageList, setimageList] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const [isLike, setIsLike] = useState([]);
    const [doCommentList, setDoCommentList] = useState(Array(boardList.length).fill(false));
    const [commentValue, setCommentValue] = useState('');

    useEffect(() => {
        async function fetchBoardList() {
            try {
                const response = await fetch(`http://localhost:4000/snsBoardList.dox`);
                const boardData = await response.json();
                setBoardList(boardData);

                const initialLikes = Array(boardData.length).fill(false);
                setIsLike(initialLikes);

                const imageRequests = boardData.map(async (boardItem) => {
                    const imageResponse = await fetch(`http://localhost:4000/snsImagesView.dox?boardNo=${boardItem.boardNo}`);
                    const imageData = await imageResponse.json();
                    return { boardNo: boardItem.boardNo, images: imageData }; // 이미지 데이터를 boardNo와 함께 객체로 저장
                });

                const imageListData = await Promise.all(imageRequests);
                setimageList(imageListData);
                console.log("imageListData===>>>", imageListData);
            } catch (error) {
                console.log("boardList error:", error);
            }
        }
        fetchBoardList();
    }, []);

    const openModal = (imageUrl) => {
        setModalImage(imageUrl);
        setModalShow(true);
    }

    const closeModal = () => {
        setModalShow(false);
        setTimeout(() => {
            setModalImage(null);
        }, 100);
    }

    const handleLikeToggle = (index) => {
        const newLikes = [...isLike];
        newLikes[index] = !newLikes[index];
        setIsLike(newLikes);
    };

    const handleCommentToggle = (index) => {
        const newDoCommentList = [...doCommentList];
        newDoCommentList[index] = !newDoCommentList[index];
        setDoCommentList(newDoCommentList);
    };

    const handleCommentInputChange = (e) => {
        setCommentValue(e.target.value);
    };

    return (
        <div className="container">
            {boardList.map((item, index) => (
                <div key={index} className='post'>
                    <div className='post-header'>
                        <div className='profile-img'>
                            <img src={item.profileImage} alt="프로필 이미지" />
                        </div>
                        <p className="username">{item.userId}</p>
                        <p className="posted-time">{item.cdate}</p>
                    </div>
                    <div className='post-content'>
                        <h2 className="post-title">{item.title}</h2>
                        <div className="image-carousel">
                            {imageList.length > 0 && Array.isArray(imageList[index].images) && (
                                <Carousel fade>
                                    {imageList[index].images.map((image, idx) => (
                                        <Carousel.Item key={idx}>
                                            <div className="image-container" onClick={() => openModal(`http://localhost:4000/${image.filePath + image.fileName}`)} style={{ cursor: "zoom-in" }}>
                                                <img
                                                    className="d-block w-100"
                                                    src={`http://localhost:4000/${image.filePath + image.fileName}`}
                                                    alt={`Slide ${idx}`}
                                                />
                                            </div>
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            )}
                        </div>
                    </div>
                    <span className="content-text">{item.content}</span>
                    <span className='content-icon'>
                        {isLike[index] ? <LikeFilledIcon width={25} onClick={() => handleLikeToggle(index)} /> :
                            <LikeEmptyIcon width={25} onClick={() => handleLikeToggle(index)} />}
                        <CommentIcon width={25} onClick={()=>handleCommentToggle(index)} />
                        <DmIcon width={25} />
                    </span>
                    <Collapse in={doCommentList[index]}>
                        <div className="comment-list">
                            <p>qwe1 댓글이면서도 댓글이 아니다요</p>
                            <p>qwe2 컴하하하하하하하</p>
                            <p>qwe3 맞춤법에 엄근진</p>
                            <input placeholder='댓글 입력...' value={commentValue} onChange={handleCommentInputChange}/>
                            {commentValue && <button>게시</button>}
                        </div>
                    </Collapse>
                </div>
            ))}
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

export default Home;
