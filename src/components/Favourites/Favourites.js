import styles from './Favourites.module.css';

const Favourites = () => {
    return (
        <section className={styles['container']}>
            <article className={styles['user-container']}>
                <div className={styles['img']}>
                    <i className="fas fa-user-circle fa-10x"></i>
                </div>
                <div>
                    <h3>Хей, сега си анонимен user.</h3>
                    <p>Влез в твоя акаунт или се регистрирай, за да можеш да запазиш любимите си продукти.</p>
                </div>
                <div>
                    <button className={styles['login']}>Влез в акаунт</button>
                    <button className={styles['register']}>Нов акаунт</button>
                </div>
            </article>
            <article className={styles['favourite-container']}>
                <h2>Любими 0 продукта</h2>
                <div >
                    <img className={styles['image']} src="img/favourite.webp" alt="favourite" />
                    <h3>Хмм, няма нито един продукт в твоя списък.</h3>
                    <h3>Виж някои препоръки, които могат да те вдъхновят.</h3>
                    <p>Добави в Любими и си направи списъци според твоите предпочитания.</p>
                    <p>Можеш да ги споделиш по всяко време с приятели и ако желаеш можеш да запазиш продуктите от количката, за да ги закупиш</p>
                </div>
                <button className={styles['login']}>Виж продукти</button>
            </article>
        </section>
    );
};

export default Favourites;