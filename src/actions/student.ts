"use server"

import fs from "fs/promises"
import {STUDENT_IMAGE_PATH} from "@/util/constants";
import {getStudentDetailsFromFileName, studentBranchMap} from "@/util";

export async function getStudents(){
    const studentDirEntries = await fs.readdir("public/" + STUDENT_IMAGE_PATH, {withFileTypes: true})
    const mappedStudentEntries = studentDirEntries.map((companyDirEntry) => {
        const {name, parentPath} = companyDirEntry
        const fileName = name.split(".").slice(0, -1).join(".")
        const studentImageUrl = (parentPath + "/" + name).slice("public/".length)
        const {studentId, studentLastName, studentFirstName} = getStudentDetailsFromFileName(fileName)
        const studentDeptIdSlice = studentId.slice(
            3, 5
        )
        return {
            studentId,
            studentImageUrl,
            studentFirstName,
            studentLastName,
            studentBranch: studentBranchMap[studentDeptIdSlice] || "",
        }
    })

    const sortedStudentEntries = mappedStudentEntries.toSorted((lhs, rhs) => {
        return parseInt(lhs.studentId) - parseInt(rhs.studentId)
    })

    return sortedStudentEntries
}