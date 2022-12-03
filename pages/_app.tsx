import 'reset-css';
import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { StoreProvider } from 'easy-peasy';
import Layout from '../components/Layout';
import { store } from '../lib/store';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <StoreProvider store={store}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </StoreProvider>
    );
}
