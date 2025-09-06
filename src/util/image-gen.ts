"use client"

import {Company, Student} from "@/util/types";
import {CONFIG, STAMP_IMAGE_PATH} from "@/util/constants";
import {sleepMs} from "@/util/index";

async function loadImageFromUrl(imageUrl: string){
    return new Promise<HTMLImageElement>((resolve, reject) => {
        try {
            const imageElement = new Image()
            imageElement.src = imageUrl
            imageElement.onload = () => {
                resolve(imageElement)
            }
        } catch (e){
            reject(e)
        }
    })
}

type CreateImageArgs = {
    canvasElement: HTMLCanvasElement | OffscreenCanvas;
    selectedCompany: Company,
    selectedStudent: Student,
}

export async function createImage(args: CreateImageArgs): Promise<string | null> {
    try {
        const {canvasElement, selectedStudent, selectedCompany} = args
        const canvasCtx = canvasElement.getContext("2d")

        if (!canvasCtx) {
            return null
        }

        canvasCtx.reset()

        const {
            studentId,
            studentImageUrl,
            studentBranch,
            studentLastName,
            studentFirstName
        } = selectedStudent

        const {companyName, companyCompensation, companyImageUrl} = selectedCompany

        const backgroundImage = await loadImageFromUrl(CONFIG.BACKGROUND_IMAGE_URL)

        canvasCtx.drawImage(
            backgroundImage,
            0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT,
            0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT
        )

        const studentImage = await loadImageFromUrl(studentImageUrl)

        canvasCtx.drawImage(
            studentImage,
            0, 0, studentImage.naturalWidth, studentImage.naturalHeight,
            160, 208, CONFIG.STUDENT_IMAGE_WIDTH, CONFIG.STUDENT_IMAGE_HEIGHT
        )

        const stampImage = await loadImageFromUrl(STAMP_IMAGE_PATH)

        canvasCtx.drawImage(
            stampImage,
            0,0, stampImage.naturalWidth, stampImage.naturalHeight,
            350, 500, CONFIG.STAMP_IMAGE_WIDTH, CONFIG.STAMP_IMAGE_HEIGHT,
        )

        const companyImage = await loadImageFromUrl(companyImageUrl)

        const companyImageAspectRatio = companyImage.naturalWidth / companyImage.naturalHeight

        const companyImageWidthAtMaxHeight = companyImageAspectRatio * CONFIG.MAX_COMPANY_IMAGE_HEIGHT

        canvasCtx.drawImage(
            companyImage,
            0, 0, companyImage.naturalWidth, companyImage.naturalHeight,
            (CONFIG.CANVAS_WIDTH - companyImageWidthAtMaxHeight) / 2,
            64,
            companyImageWidthAtMaxHeight,
            CONFIG.MAX_COMPANY_IMAGE_HEIGHT
        )

        canvasCtx.font = `${CONFIG.NAME_FONT_SIZE_PX}px ${CONFIG.NAME_FONT_NAME}`
        canvasCtx.fillStyle = CONFIG.NAME_FONT_COLOR
        canvasCtx.fillText(studentFirstName, 144, 672)
        canvasCtx.fillText(studentLastName, 144, 716)

        canvasCtx.font = `${CONFIG.BRANCH_FONT_SIZE_PX}px ${CONFIG.NAME_FONT_NAME}`
        canvasCtx.fillStyle = CONFIG.BRANCH_FONT_COLOR
        canvasCtx.fillText(studentBranch, 144, 754)

        const [compDigitA, compDigitB, compDigitC, compDigitD] = Math.floor(companyCompensation).toString().padStart(4, '0').split("")

        let compensationString: string;

        if (companyCompensation > 1000){
            compensationString = compDigitA + compDigitB + "." + compDigitC
        } else {
            compensationString = compDigitB + "." + compDigitC + compDigitD
        }

        // const tempX = 350 + (CONFIG.STAMP_IMAGE_WIDTH) / 2
        // const tempY = 500 + (CONFIG.STAMP_IMAGE_HEIGHT) / 2

        await sleepMs(500)

        canvasCtx.rotate(-30 * Math.PI / 180)

        console.log("Drawing")

        canvasCtx.font = `${CONFIG.STAMP_FONT_SIZE_PX}px ${CONFIG.STAMP_FONT_NAME}`
        canvasCtx.fillStyle = CONFIG.STAMP_FONT_COLOR
        canvasCtx.fillText(compensationString + " LPA", 32, 750)

        canvasCtx.rotate(30 * Math.PI / 180)

        await sleepMs(500)

        console.log("Done Drawing")

        if ("toDataURL" in canvasElement) {
            return canvasElement.toDataURL("image/png", 1)
        } else {
            const canvasBlob = await canvasElement.convertToBlob({
                type: "image/png",
                quality: 1
            })

            return URL.createObjectURL(canvasBlob)
        }
    } catch (e){
        console.error(e)
        return null
    }
}