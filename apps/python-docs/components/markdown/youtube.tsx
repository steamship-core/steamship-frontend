export type YouTubeProps = {
    id: string;
    autoplay: boolean
}

export function YouTube({ id, autoplay = false }: YouTubeProps) {
    return (
        <div className={'py-8'}>
            <iframe
                id={`ytplayer-${id}`}
                src={`https://www.youtube.com/embed/${id}?autoplay={${
                    autoplay ? '1' : '0'
                }&origin=http://steamship.com`}
                frameBorder="0"
            ></iframe>
        </div>
    );
}
