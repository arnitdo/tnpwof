"use client"

import {Company, Student} from "@/util/types";
import {useEffect, useRef, useState} from "react";
import {createImage} from "@/util/image-gen";
import {CONFIG} from "@/util/constants";
import {saveCompanyImage, saveOutputImage} from "@/actions/images";

type EditorProps = {
    studentsData: Student[],
}

export default function UploadCompanyEditor(props: EditorProps) {
    const {studentsData} = props

    const [selectedStudent, setSelectedStudent] = useState<Student | undefined>(studentsData[0])
    const [selectedCompany, setSelectedCompany] = useState<Company>({
        companyName: "",
        companyImageUrl: "",
        companyCompensation: 0
    })

    const [generatedImage, setGeneratedImage] = useState<string | null>(null)

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        async function createAndReturnImage(){
            if (canvasRef.current && selectedStudent && selectedCompany){
                const imageResult = await createImage({
                    canvasElement: canvasRef.current,
                    selectedStudent: selectedStudent,
                    selectedCompany: {
                        ...selectedCompany,
                        companyCompensation: selectedCompany.companyCompensation * 100
                    }
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

    if (!window.location.href.includes(process.env.NEXT_PUBLIC_SECRET_KEY!)){
        return null
    }

    const isCorrectSubmission = selectedCompany.companyName.trim() !== "" &&
        selectedCompany.companyCompensation > 0 &&
        selectedCompany.companyImageUrl.trim() !== ""

    return (
        <div className={"w-screen min-h-screen grid grid-cols-2 gap-4 p-4"}>
            {/*  Left Side, Controls Panel  */}
            <div className={"flex flex-col justify-start items-start gap-4 col-span-1 border p-4"}>
                <h2 className={"text-xl font-bold"}>Controls</h2>
                <div>
                    <h3 className={"text-lg"}>Company Name</h3>
                    <input
                        type={"text"}
                        className={"border p-2"}
                        value={selectedCompany.companyName}
                        onChange={(e) => {
                            setSelectedCompany({
                                ...selectedCompany,
                                companyName: e.target.value
                            })
                        }}
                    />
                </div>
                <div>
                    <h3 className={"text-lg"}>Compensation (LPA)</h3>
                    <input
                        type={"number"}
                        min={0}
                        step={0.01}
                        className={"border p-2"}
                        value={selectedCompany.companyCompensation}
                        onChange={(e) => {
                            setSelectedCompany({
                                ...selectedCompany,
                                companyCompensation: parseFloat(e.target.value) || 0
                            })
                        }}
                    />
                </div>
                {/*file input*/}
                <div>
                    <h3 className={"text-lg"}>Company Image</h3>
                    <input
                        type={"file"}
                        accept={"image/*"}
                        className={"border p-2"}
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file){
                                const reader = new FileReader()
                                reader.onload = (event) => {
                                    const imageUrl = event.target?.result as string
                                    setSelectedCompany({
                                        ...selectedCompany,
                                        companyImageUrl: imageUrl
                                    })
                                }
                                reader.readAsDataURL(file)
                            }
                        }}
                    />
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
                    disabled={!isCorrectSubmission}
                    onClick={() => {
                        if (isCorrectSubmission){
                            saveCompanyImage({
                                companyName: selectedCompany.companyName,
                                companyCompensation: selectedCompany.companyCompensation,
                                imageDataUrl: selectedCompany.companyImageUrl
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
                        id={"upload-student-editor-canvas"}
                        width={CONFIG.CANVAS_WIDTH}
                        height={CONFIG.CANVAS_HEIGHT}
                        className={"border"}
                    />
                </div>
            </div>
        </div>
    )
}