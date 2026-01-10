import {getAllSavedImages} from "@/actions/images";
import HomeGrid from "@/components/home-grid";

export default async function Home() {
    const savedImages = await getAllSavedImages()

    return (
        <div className={"w-screen h-screen flex flex-row"}>
            <div className={"h-screen flex-[0.1] flex flex-col gap-4 items-center justify-center border p-2"}>
                <a href={"/create"} className={"border p-4 text-center"}>
                    Create Image
                </a>
	            <a href={"/bulk"} className={"border p-4 text-center"}>
                    Create Bulk
                </a>
                <a href={"/upload-student"} className={"border p-4 text-center"}>
                    Upload Student Image
                </a>
                <a href={"/upload-company"} className={"border p-4 text-center"}>
                    Upload Company Image
                </a>
            </div>
            <HomeGrid imageUrls={savedImages} />
        </div>
    )
}