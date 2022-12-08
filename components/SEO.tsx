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
                images: [
                    // {
                    //     url: 'https://rennalabs.xyz/og-image.png',
                    //     width: 300,
                    //     height: 300,
                    //     alt: 'Renna Labs Logo',
                    //     type: 'image/png'
                    // }
                ],
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
                    href: 'http://localhost:3000/favicon.ico'
                },
                {
                    rel: 'apple-touch-icon',
                    href: 'http://localhost:3000/apple-touch-icon.png',
                    sizes: '180x180'
                }
            ]}
        />
    );
}
