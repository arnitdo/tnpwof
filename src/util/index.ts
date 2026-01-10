import {CONFIG} from "@/util/constants";

export function canonicalizeText(textStr: string){
    return (
	    textStr.slice(0, 1).toUpperCase() + textStr.slice(1).toLowerCase()
    ).trim()
}

export function parseCompensation(compensationAmt: string){
    if (compensationAmt.length !== 4){
        throw new Error("Invalid compensation amount format")
    }
    const compensationNumber = parseInt(compensationAmt)
    if (isNaN(compensationNumber)){
        throw new Error("Invalid compensation amount format")
    }
    return compensationNumber / 100
}

export function splitFileName(fileName: string) {
    const splitChunks = fileName.split(CONFIG.FIELD_SEPARATOR)
    return splitChunks
}

export function getStudentDetailsFromFileName(fileName: string) {
    const splitChunks = splitFileName(fileName)
    if (splitChunks.length < 3) {
        throw new Error("Invalid file name format")
    }
    const studentId = splitChunks[0]
    const studentFirstName = splitChunks[1]
    const studentLastName = splitChunks[2]
    return {
        studentId,
        studentFirstName: canonicalizeText(studentFirstName),
        studentLastName: canonicalizeText(studentLastName),
    }
}

export function getCompanyDetailsFromFileName(fileName: string){
    const splitChunks = splitFileName(fileName)
    if (splitChunks.length < 2) {
        throw new Error("Invalid file name format")
    }
    const companyName = splitChunks[0]
    const companyCompensation = Number.parseInt(splitChunks[1])
    return {
        companyName,
        companyCompensation
    }
}

export async function sleepMs(ms: number){
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export const studentBranchMap: Record<string, string> = {
    "02": "EXTC",
    "03": "IT",
    "04": "COMPS",
    "05": "MECH",
    "09": "CSE (DS)",
    "17": "AIML",
    "18": "AIDS",
    "19": "CSE (ICB)"
}