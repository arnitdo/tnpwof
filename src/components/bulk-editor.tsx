"use client"

import {Company, Student} from "@/util/types";
import {useEffect, useMemo, useRef, useState} from "react";
import {createImage} from "@/util/image-gen";
import {CONFIG} from "@/util/constants";
import {saveOutputImage} from "@/actions/images";
import {sleepMs} from "@/util";

type EditorProps = {
    companiesData: Company[],
    studentsData: Student[],
}

export default function BulkEditor(props: EditorProps) {
    const {companiesData, studentsData} = props

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [csvData, setCSVData] = useState<string>(() => {
		if (typeof window !== "undefined"){
			const savedData = localStorage.getItem("csvData")
			if (savedData){
				return JSON.parse(savedData)
			}
		}

		return ""
    })

    // useEffect(() => {
    //     async function createAndReturnImage(){
    //         if (canvasRef.current && selectedStudent && selectedCompany){
    //             const imageResult = await createImage({
    //                 canvasElement: canvasRef.current,
    //                 selectedStudent: selectedStudent,
    //                 selectedCompany: selectedCompany
    //             })
    //             return imageResult
    //         }
    //     }
    //
    //     setGeneratedImage(null)
    //     createAndReturnImage().then((imageBase64) => {
    //         if (imageBase64){
    //             setGeneratedImage(imageBase64)
    //         }
    //     })
    // }, [selectedStudent, selectedCompany]);

    const csvParsed = useMemo(() => {
        const allRows = csvData
            .split("\n")
            .map((row) => {
                return row.split(",")
            })
        const mappedRows = allRows.map((rowData) => {
            const companyName = rowData[0]?.trim() ?? ""
            const companyComp = parseInt(rowData[1]?.trim())
            const targetCompany = companiesData.find((companyData) => {
                return (
                    companyData.companyName === companyName &&
                    companyData.companyCompensation === companyComp
                )
            })

            const studentSAP = rowData[2]?.trim() ?? ""
            const targetStudent = studentsData.find((studentData) => {
                return studentData.studentId === studentSAP
            })

            if (!targetCompany) {
                return `No such company ${companyName} with compensation ${companyComp}`
            }

            if (!targetStudent) {
                return `No such student with SAP ${studentSAP}`

            }

            return [targetCompany, targetStudent] as const
        })

	    const firstValid = mappedRows.find((rowData) => {
			    return typeof rowData !== "string"
	    })

	    if (!firstValid){
		    return mappedRows
	    }

		// Workaround since fonts may not be loaded for the first bulk entry
        return [
			firstValid,
	        ...mappedRows
        ]
    }, [csvData])

    async function generateImages(){
        for (const parsedData of csvParsed) {
            if (typeof parsedData === "string") {
                continue
            }

            const [companyData, studentData] = parsedData

            if (canvasRef.current && companyData && studentData) {
                const imageResult = await createImage({
                    canvasElement: canvasRef.current,
                    selectedStudent: studentData,
                    selectedCompany: companyData
                })

                if (imageResult){
                    await saveOutputImage({
                        companyName: companyData.companyName,
                        studentId: studentData.studentId,
                        imageDataUrl: imageResult
                    })

                    await sleepMs(1000)
                }
            }
        }
		localStorage.setItem("csvData", JSON.stringify(csvData))
    }

    if (typeof window !== "undefined" && !window.location.href.includes(process.env.NEXT_PUBLIC_SECRET_KEY!)){
        return null
    }

    return (
        <div className={"w-screen min-h-screen grid grid-cols-2 gap-4 p-4"}>
            {/*  Left Side, Controls Panel  */}
            <div className={"flex flex-col justify-start items-start gap-4 col-span-1 border p-4"}>
                <h2 className={"text-xl font-bold"}>Controls</h2>
                <textarea
                    value={csvData}
                    onChange={(e) => setCSVData(e.target.value)}
                    className={"border p-2 w-full h-96"}
                    placeholder={"Company Name,Company Compensation,Student SAP\nUBS,1800,60012345678\nCompany B,1415,60012345678"}
                />
                <div className={"flex flex-col gap-1 overflow-y-scroll max-h-96"}>
                {
                    csvParsed.map((parsedData, parsedIdx) => {
	                    if (typeof parsedData === "string") {
							return <span key={parsedIdx} className={"text-red-600"}>Line{parsedIdx + 1}: {parsedData}</span>
	                    }

                        const [companyData, studentData] = parsedData

                        return <span>
                            {companyData.companyName} - {companyData.companyCompensation / 100}LPA : {studentData.studentId} {studentData.studentFirstName} {studentData.studentLastName}
                        </span>
                    })
                }
                </div>
                <button
                    className={"border p-2"}
                    onClick={() => {
                        generateImages()
                    }}
                >
                    Mass Generate & Save Images
                </button>
            </div>
            {/*  Right Side, Canvas  */}
            <div className={"flex flex-col justify-between items-center gap-4 col-span-1 border p-4"}>
                <div className={"flex flex-row justify-between items-center gap-4"}>
                    <h2 className={"text-xl font-bold"}>Preview (Print May Vary)</h2>
                    {/*<a href={generatedImage ?? undefined} download>*/}
                    {/*    <button className={"border p-2"}>Download</button>*/}
                    {/*</a>*/}
                </div>
                <div className={"flex justify-center items-center flex-grow"}>
                    <canvas
                        ref={canvasRef}
                        id={"create-editor-canvas"}
                        width={CONFIG.CANVAS_WIDTH}
                        height={CONFIG.CANVAS_HEIGHT}
                        className={"border"}
                    />
                </div>
            </div>
        </div>
    )
}