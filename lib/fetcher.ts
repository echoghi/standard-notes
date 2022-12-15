export default function fetcher(url: string, data?: any) {
    return fetch(`${window.location.origin}/api${url}`, {
        method: data ? 'POST' : 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data ? JSON.stringify(data) : undefined
    }).then((res) => {
        return res.json();
    });
}
