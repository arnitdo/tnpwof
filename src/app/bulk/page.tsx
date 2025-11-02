import {getCompanies} from "@/actions/company";
import {getStudents} from "@/actions/student";
import ScreenSize from "@/components/screen-size";
import {CONFIG} from "@/util/constants";
import CreateEditor from "@/components/create-editor";
import BulkEditor from "@/components/bulk-editor";

export default async function BulkPage(){
    const companiesData = await getCompanies()
    const studentsData = await getStudents()

    return (
        <ScreenSize
            minHeight={CONFIG.CANVAS_HEIGHT}
            minWidth={CONFIG.CANVAS_WIDTH * 2}
        >
            <BulkEditor
                companiesData={companiesData}
                studentsData={studentsData}
            />
        </ScreenSize>
    )
}