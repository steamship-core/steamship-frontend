export function YouTube({ id, autoplay = false }) {
    return (
        <div className={'py-8'}>
            <iframe
                id="ytplayer"
                src={`https://www.youtube.com/embed/${id}?autoplay={${
                    autoplay ? '1' : '0'
                }&origin=http://steamship.com`}
                frameBorder="0"
            ></iframe>
        </div>
    );
}
