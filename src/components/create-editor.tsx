"use client"

import {Company, Student} from "@/util/types";
import {useEffect, useRef, useState} from "react";
import {createImage} from "@/util/image-gen";
import {CONFIG} from "@/util/constants";
import {saveOutputImage} from "@/actions/images";

type EditorProps = {
    companiesData: Company[],
    studentsData: Student[],
}

export default function CreateEditor(props: EditorProps) {
    const {companiesData, studentsData} = props

    const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(studentsData[0])
    const [selectedCompany, setSelectedCompany] = useState<Company | undefined>(companiesData[0])
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        async function createAndReturnImage(){
            if (canvasRef.current && selectedStudent && selectedCompany){
                const imageResult = await createImage({
                    canvasElement: canvasRef.current,
                    selectedStudent: selectedStudent,
                    selectedCompany: selectedCompany
                })
                return imageResult
            }
        }

        setGeneratedImage(null)
        createAndReturnImage().then((imageBase64) => {
            if (imageBase64){
                setGeneratedImage(imageBase64)
            }
        })
    }, [selectedStudent, selectedCompany]);

    if (typeof window !== "undefined" && !window.location.href.includes(process.env.NEXT_PUBLIC_SECRET_KEY!)){
        return null
    }

    return (
        <div className={"w-screen min-h-screen grid grid-cols-2 gap-4 p-4"}>
            {/*  Left Side, Controls Panel  */}
            <div className={"flex flex-col justify-start items-start gap-4 col-span-1 border p-4"}>
                <h2 className={"text-xl font-bold"}>Controls</h2>
                <div>
                    <h3 className={"text-lg"}>Select Company</h3>
                    <select
                        value={selectedCompany?.companyImageUrl ?? undefined}
                        className={"border p-2"}
                        onChange={(e) => {
                            setSelectedCompany(
                                companiesData.find((companyData) => {
                                    return companyData.companyImageUrl === e.target.value
                                })
                            )
                        }}
                    >
                        {
                            companiesData.map((companyData) => {
                                return (
                                    <option key={companyData.companyImageUrl} value={companyData.companyImageUrl}>
                                        {companyData.companyName} - {companyData.companyCompensation / 100}LPA
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>
                <div>
                    <h3 className={"text-lg"}>Select Student</h3>
                    <select
                        value={selectedStudent?.studentId ?? undefined}
                        className={"border p-2"}
                        onChange={(e) => {
                            setSelectedStudent(
                                studentsData.find((studentData) => {
                                    return studentData.studentId === e.target.value
                                })
                            )
                        }}
                    >
                        {
                            studentsData.map((studentData) => {
                                return (
                                    <option key={studentData.studentId} value={studentData.studentId}>
                                        {studentData.studentId} {studentData.studentFirstName} {studentData.studentLastName}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>
                <button
                    className={"border p-2"}
                    disabled={generatedImage === null}
                    onClick={() => {
                        if (generatedImage && selectedStudent && selectedCompany){
                            saveOutputImage({
                                imageDataUrl: generatedImage,
                                studentId: selectedStudent.studentId,
                                companyName: selectedCompany.companyName
                            }).then(() => {
                                window.alert("Saved Successfully")
                            })
                        }
                    }}
                >
                    Save To Server
                </button>
            </div>
            {/*  Right Side, Canvas  */}
            <div className={"flex flex-col justify-between items-center gap-4 col-span-1 border p-4"}>
                <div className={"flex flex-row justify-between items-center gap-4"}>
                    <h2 className={"text-xl font-bold"}>Preview (Print May Vary)</h2>
                    <a href={generatedImage ?? undefined} download>
                        <button className={"border p-2"}>Download</button>
                    </a>
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