
BookReads-app Including:

Components with:

 - Home Page
    --including 2 sections with books sorted by the newest one and books by the highest rating

 - Books by category
    --books sorted by books category

 - All books page
    --can see all books
    --added pagination 

 - Login page
    --already registered users 
        --sboyukliev1990@mail.bg / password: 123456
        --admin@abv.bg / passowrd: 123456

 - Register Page
    --regex validation for new user, password must contain at least one letter and one number

 - Log out page

 - Favourite Books page
    --you can see all your favourite books and remove them from there.

 - My Books Page
    --you can Add, Edit and Delete your own books.

 - Search Book Page
    --can search books by Book Title

 - Create Book Page

 - Edit Page

 - Details Page
    --you can Add and Delete comment and rating(only if you are logged in, also if you are not owner on the book);
    --you can add book to favourite if you are logged in;

-404 page
    -- if path dont match, show 404 page


-Loading Spinner for waiting the requests.

-Common folder for Route Guards

Contexts
    -AuthContext
        -- context for authentication 
    -BookContext
        --menaging book state
    -FavouriteBookContext
        --managing favourite books
    -SearchContext
        --managing searched books

Custom hooks 
    --useError - hook for error handling
    --useForm - hook for controled forms 
    --useLocalStorage - hook for managing the logal storage for logged user


Resources used:
    --react-bootstrap
    --react-bootstrap-pagination-control
    --SoftUni practice server
    --react-rating-stars-component




Using SoftUni practice server for authentication and API requests.

Deployed in firebase: https://react-book-reads.web.app/