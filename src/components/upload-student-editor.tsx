"use client"

import {Company, Student} from "@/util/types";
import {useEffect, useRef, useState} from "react";
import {createImage} from "@/util/image-gen";
import {CONFIG} from "@/util/constants";
import {saveOutputImage, saveStudentImage} from "@/actions/images";
import {studentBranchMap} from "@/util";

type EditorProps = {
    companiesData: Company[]
}

export default function UploadStudentEditor(props: EditorProps) {
    const {companiesData} = props

    const [selectedStudent, setSelectedStudent] = useState<Student>({
        studentFirstName: "",
        studentLastName: "",
        studentId: "60000000000",
        studentBranch: Object.values(studentBranchMap)[0],
        studentImageUrl: ""
    })

    const [selectedCompany, setSelectedCompany] = useState<Company | undefined>(companiesData[0])
    const [generatedImage, setGeneratedImage] = useState<string | null>(null)

    const previewCanvasRef = useRef<HTMLCanvasElement>(null);

    console.log({selectedCompany})

    useEffect(() => {
        async function createAndReturnImage(){
            if (previewCanvasRef.current && selectedStudent.studentImageUrl && selectedCompany){
                const imageResult = await createImage({
                    canvasElement: previewCanvasRef.current,
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

    const isValidSubmission = selectedStudent.studentImageUrl.trim() !== "" &&
        selectedStudent.studentFirstName.trim() !== "" &&
        selectedStudent.studentLastName.trim() !== "" &&
        selectedStudent.studentId.match(/^600(02|03|04|05|09|17|18|19)2(0|1|2|3)\d{4}$/) !== null

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
                    Save Student Image To Server
                <form className={"flex flex-col gap-2"} onSubmit={() => {}}>
                    <h3 className={"text-lg"}>Student Details</h3>
                    <div className={"flex flex-row items-center justify-between gap-2"}>
                        <label htmlFor={"studentId"}>SAP ID</label>
                        <input
                            className={"border p-1 invalid:border-red-500"}
                            name={"studentId"}
                            type={"text"}
                            required
                            pattern={"^600(02|03|04|05|09|17|18|19)2(0|1|2|3)\\d{4}$"}
                            value={selectedStudent.studentId}
                            onChange={(e) => {
                                setSelectedStudent((prevData) => {
                                    return {
                                        ...prevData,
                                        studentId: e.target.value
                                    }
                                })
                            }}
                        />
                    </div>
                    <div className={"flex flex-row items-center justify-between gap-2"}>
                        First Name
                        <input
                            className={"border p-1 invalid:border-red-500"}
                            required
                            value={selectedStudent.studentFirstName}
                            onChange={(e) => {
                                setSelectedStudent((prevData) => {
                                    return {
                                        ...prevData,
                                        studentFirstName: e.target.value
                                    }
                                })
                            }}
                        />
                    </div>
                    <div className={"flex flex-row items-center justify-between gap-2"}>
                        Last Name
                        <input
                            className={"border p-1 invalid:border-red-500"}
                            required
                            type={"text"}
                            value={selectedStudent.studentLastName}
                            onChange={(e) => {
                                setSelectedStudent((prevData) => {
                                    return {
                                        ...prevData,
                                        studentLastName: e.target.value
                                    }
                                })
                            }}
                        />
                    </div>
                    <div className={"flex flex-row items-center justify-between gap-2"}>
                        Branch
                        <select value={selectedStudent.studentBranch} className={"border p-1"} onChange={(e) => {
                            setSelectedStudent((prevState) => {
                                return {
                                    ...prevState,
                                    studentBranch: e.target.value
                                }
                            })
                        }}>
                            {
                                Object.values(studentBranchMap).map((branchName) => {
                                    return (
                                        <option key={branchName} value={branchName}>{branchName}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={"flex flex-row items-center justify-between gap-2"}>
                        Image
                        <input
                            className={"border p-1"}
                            type={"file"}
                            accept={"image/*"}
                            onChange={(e) => {
                                const fileArr = e.target.files
                                if (fileArr === null || fileArr.length === 0){
                                    return
                                }

                                const uploadedFile = fileArr[0]

                                const fileReader = new FileReader()

                                fileReader.addEventListener("load", (frEvent) => {
                                    setSelectedStudent((prevData) => {
                                        return {
                                            ...prevData,
                                            studentImageUrl: fileReader.result as string
                                        }
                                    })
                                })

                                fileReader.readAsDataURL(uploadedFile)
                            }}
                        />
                    </div>
                    <button
                        className={"border p-2"}
                        disabled={!isValidSubmission}
                        onClick={() => {
                            if (isValidSubmission){
                                saveStudentImage({
                                    imageDataUrl: selectedStudent.studentImageUrl,
                                    studentId: selectedStudent.studentId,
                                    studentFirstName: selectedStudent.studentFirstName,
                                    studentLastName: selectedStudent.studentLastName,
                                })
                            }
                        }}
                    >Save Student Image To Server</button>
                </form>
                <div>
                    <h3 className={"text-lg"}>Note</h3>
                    <ol className={"list-decimal list-inside"}>
                        <li>Best dimensions for student image are {CONFIG.STUDENT_IMAGE_WIDTH}px wide by {CONFIG.STUDENT_IMAGE_HEIGHT}px high (or the same aspect ratio)</li>
                        <li>Use a tool like  <a href={"https://www.photopea.com/"} className={"text-blue-400 underline"}>Photopea</a> to edit your images before uploading them here</li>
                        <li>Upon clicking "Save" above, your image (and not the preview on the right) will be saved to the server</li>
                        <li>The company selected above is just for your reference, actual images will be generated later</li>
                    </ol>
                </div>
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
                        ref={previewCanvasRef}
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