"use server"
import fs from "fs/promises"
import {COMPANY_IMAGE_PATH, OUTPUT_IMAGE_PATH, STUDENT_IMAGE_PATH} from "@/util/constants";
import {canonicalizeText} from "@/util";

type SaveWOFImageArgs = {
    studentId: string,
    companyName: string
    imageDataUrl: string,
}
export async function saveOutputImage(args: SaveWOFImageArgs){
    const {studentId, companyName, imageDataUrl} = args

    const filenameOutput = `${studentId}_${companyName}.png`
    const base64Data = imageDataUrl.split(",")[1]

    const imageBuffer = Buffer.from(base64Data, 'base64')

    await fs.writeFile(
        "public/" + OUTPUT_IMAGE_PATH + "/" + filenameOutput,
        imageBuffer,
    )

    return OUTPUT_IMAGE_PATH + "/" + filenameOutput
}

export async function getAllSavedImages(){
    const outputDirEntries = await fs.readdir("public/" + OUTPUT_IMAGE_PATH, {withFileTypes: true})
    const outputImageUrls = outputDirEntries.map((dirEntry) => {
        const {name, parentPath} = dirEntry
        if (!name.endsWith(".png")){
            return null
        }
        const imageUrl = (parentPath + "/" + name).slice("public/".length)
        return imageUrl
    })

    const filteredImageUrls = outputImageUrls.filter((url) => {
        return url !== null
    })

    const sortedImageUrls = filteredImageUrls.toSorted((lhs, rhs) => {
        if (lhs && rhs) {
            return lhs.localeCompare(rhs)
        }
        return 0
    })

    return sortedImageUrls
}

type SaveStudentImageArgs = {
    studentId: string,
    studentFirstName: string,
    studentLastName: string,
    imageDataUrl: string,
}

export async function saveStudentImage(args: SaveStudentImageArgs){
    const {studentId, studentFirstName, studentLastName} = args
    const filenameOutput = `${studentId}_${canonicalizeText(studentFirstName)}_${canonicalizeText(studentLastName)}.png`

    const base64Data = args.imageDataUrl.split(",")[1]

    const imageBuffer = Buffer.from(base64Data, 'base64')

    await fs.writeFile(
        "public/" + STUDENT_IMAGE_PATH + "/" + filenameOutput,
        imageBuffer,
    )

    return STUDENT_IMAGE_PATH + "/" + filenameOutput
}

type SaveCompanyImageArgs = {
    companyName: string,
    companyCompensation: number,
    imageDataUrl: string,
}

export async function saveCompanyImage(args: SaveCompanyImageArgs){
    const {companyName, companyCompensation} = args
    const fmtComp = Math.floor(companyCompensation * 100).toString().padStart(4, "0")
    const filenameOutput = `${companyName}_${fmtComp}.png`

    const base64Data = args.imageDataUrl.split(",")[1]

    const imageBuffer = Buffer.from(base64Data, 'base64')

    await fs.writeFile(
        "public/" + COMPANY_IMAGE_PATH + "/" + filenameOutput,
        imageBuffer,
    )

    return COMPANY_IMAGE_PATH + "/" + filenameOutput
}