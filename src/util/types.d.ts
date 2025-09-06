export type Company = {
    companyName: string,
    companyImageUrl: string,
    companyCompensation: number,
}

export type Student = {
    studentId: string,
    studentImageUrl: string,
    studentBranch: string,
    studentFirstName: string,
    studentLastName: string,
}

type PositionArg = {
    offsetX: number,
    offsetY: number,
} & ({height: number} | {width: number})