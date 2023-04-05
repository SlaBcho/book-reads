import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { BookProvider } from '../../context/BookContext';
import BookItem from './BookItem';

describe('Book Item Component', () => {
    test('Show book title', () => {
        const title = 'Test Title';

        render(
            <BrowserRouter>
                <BookProvider>
                    <BookItem _id={'id'} title={title} />
                </BookProvider>
            </BrowserRouter>);

        expect(screen.getByText(title)).toBeInTheDocument();
    });

    // test('Click on details', async () => {
    //     global.window = { location: { pathname: null } };
    //     const itemId = 'id';
    //     render(
    //         <BrowserRouter>
    //             <BookProvider>
    //                 <BookItem _id={itemId} />
    //             </BookProvider>
    //         </BrowserRouter>
    //     );
    //     await userEvent.click(screen.getAllByText('Details'));

    //     expect(global.window.location.pathname).toContain(`/details/${itemId}`);

    // });
});