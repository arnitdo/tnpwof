import {getCompanies} from "@/actions/company";
import {getStudents} from "@/actions/student";
import UploadCompanyEditor from "@/components/upload-company-editor";
import ScreenSize from "@/components/screen-size";
import {CONFIG} from "@/util/constants";

export default async function UploadPage(){
    const companiesData = await getCompanies()
    const studentsData = await getStudents()

    return (
        <ScreenSize
            minHeight={CONFIG.CANVAS_HEIGHT}
            minWidth={CONFIG.CANVAS_WIDTH * 2}
        >
            <UploadCompanyEditor
                studentsData={studentsData}
            />
        </ScreenSize>
    )
}