import {getCompanies} from "@/actions/company";
import {getStudents} from "@/actions/student";
import ScreenSize from "@/components/screen-size";
import {CONFIG} from "@/util/constants";
import CreateEditor from "@/components/create-editor";

export default async function CreatePage(){
    const companiesData = await getCompanies()
    const studentsData = await getStudents()

    return (
        <ScreenSize
            minHeight={CONFIG.CANVAS_HEIGHT}
            minWidth={CONFIG.CANVAS_WIDTH * 2}
        >
            <CreateEditor
                companiesData={companiesData}
                studentsData={studentsData}
            />
        </ScreenSize>
    )
}