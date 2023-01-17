import 'reset-css';

import type { AppProps } from 'next/app';
import { StoreProvider } from 'easy-peasy';

import Layout from '../components/Layout';
import { store } from '../services';

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <StoreProvider store={store}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </StoreProvider>
    );
};

export default App;
