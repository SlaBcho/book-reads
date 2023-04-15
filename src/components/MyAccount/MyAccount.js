import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BookContext } from '../../context/BookContext';
import { FavouriteBookContext } from '../../context/FavouriteBooksContext';

import * as commentService from '../../services/commentService';
import * as profileService from '../../services/profileService';

import EditFormModal from '../Modal/EditFormModal';
import CreateFormModal from '../Modal/CreateFormModal';
import styles from './MyAccount.module.css';
import { ProfileContext } from '../../context/ProfileContext';

const MyAccount = () => {
    const { user } = useContext(AuthContext);
    const { favourite } = useContext(FavouriteBookContext);
    const { books } = useContext(BookContext);
    const {profileInfo, onSetProfile, onEditProfile} = useContext(ProfileContext);
    const [comments, setComments] = useState([]);
    const [show, setShow] = useState(false);

    useEffect(() => {
        commentService.getAllComments(user._id)
            .then(res => {
                setComments(res);
            });
    }, [user]);

    const favouriteBook = favourite.filter(b => b.userId === user._id);
    const myBooks = books.filter(b => b._ownerId === user._id);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <section className={styles['my-account-wrapper']}>
            <section className={styles['my-account']}>
                <h2 className={styles['info-title']}>Данни за акаунта</h2>
                <div>
                    <div className={styles['my-account-img']}>
                    <i className="fas fa-user-circle fa-6x"></i>

                    </div>
                    <div className={styles['logoutBtn']}>
                        <Link className={styles['logout']} to="/logout">
                            <i className="fa-solid fa-arrow-right-from-bracket"></i>
                            Изход
                        </Link>
                    </div>
                </div>
                <div className={styles['my-account-info']}>
                    {profileInfo ?
                        <>
                            <p>Псевдоним: {profileInfo.username}</p>
                            <p>Име: {profileInfo.name}</p>
                            <p>Имейл: {user.email}</p>
                            <p>Рождена дата: {profileInfo.dateOfBirth}</p>
                            <button onClick={handleShow} className={styles['manage']}>Управлявай личните си данни</button>
                            <EditFormModal
                                show={show}
                                handleClose={handleClose}
                                onEditProfile={onEditProfile}
                                profileInfo={profileInfo} />
                        </>
                        :
                        <>
                            <p>Псевдоним: </p>
                            <p>Име: </p>
                            <p>Имейл: {user.email} </p>
                            <p>Рождена дата: </p>
                            <button onClick={handleShow} className={styles['manage']}>Попълни личните си данни</button>
                            <CreateFormModal
                                show={show}
                                handleClose={handleClose}
                                onSetProfile={onSetProfile}
                                email={user.email} />
                        </>
                    }

                </div>

            </section>
            <section className={styles['my-activity']}>
                <h2 className={styles['info-title']}>Моята дейност</h2>
                <div>
                    <i className="fas fa-book fa-3x"></i>
                    <p>{myBooks.length} добавени книги</p>
                    <div className={styles['divider']}></div>
                    <Link to='/my-books'>Виж добавените книги</Link>
                </div>
                <div>
                    <i className="fa-solid fa-heart fa-3x"></i>
                    <p>{favouriteBook.length} любими книги</p>
                    <div className={styles['divider']}></div>
                    <Link to='/favourites'>Виж любимите книги</Link>
                </div>
                <div>
                    <i className="fa-solid fa-star fa-3x"></i>
                    <p>{comments.length} добавени ревюта</p>
                    <div className={styles['divider']}></div>
                    <Link to='/my-books'>Виж твоите ревюта</Link>
                </div>
            </section>
        </section>
    );
};

export default MyAccount;