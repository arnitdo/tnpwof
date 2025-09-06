"use client"

type HomeGridProps = {
    imageUrls: string[]
}

export default function HomeGrid(props: HomeGridProps) {
    const {imageUrls} = props

    if (!window.location.href.includes(process.env.NEXT_PUBLIC_SECRET_KEY!)){
        return null
    }

    return (
        <div className={"h-screen p-4 overflow-y-scroll"}>
            {imageUrls.length === 0 && (
                <p>No images generated yet. Please save some images on server first.</p>
            )}
            {imageUrls.length > 0 && (
                <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
                    {imageUrls.map((imageUrl, index) => (
                        <div key={index} className={"flex flex-col border p-2"}>
                            <img
                                src={imageUrl} alt={`Generated Image ${index + 1}`}
                                className={"w-full h-auto"}
                            />
                            <a href={imageUrl} download className={"mt-2 inline-block"}>
                                <button className={"border p-2 w-full"}>Download</button>
                            </a>
                            <a href={imageUrl}>{imageUrl}</a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}