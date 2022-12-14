import { NextSeo } from 'next-seo';

export default function Seo({
    pageTitle,
    description,
    currentURL
}: {
    pageTitle: string;
    description: string;
    currentURL: string;
}) {
    return (
        <NextSeo
            title={pageTitle}
            description={description}
            canonical={currentURL}
            openGraph={{
                url: currentURL,
                title: pageTitle,
                description,
                images: [],
                site_name: 'Standard Notes'
            }}
            additionalMetaTags={[
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1'
                }
            ]}
            additionalLinkTags={[
                {
                    rel: 'icon',
                    href: '/favicon.ico'
                },
                {
                    rel: 'apple-touch-icon',
                    href: '/apple-touch-icon.png',
                    sizes: '180x180'
                },
                {
                    rel: 'manifest',
                    href: '/manifest.json'
                }
            ]}
        />
    );
}
