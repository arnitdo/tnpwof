"use server"

import fs from "fs/promises"
import {COMPANY_IMAGE_PATH} from "@/util/constants";
import {getCompanyDetailsFromFileName} from "@/util";

export async function getCompanies(){
    const companyDirEntries = await fs.readdir("public/" + COMPANY_IMAGE_PATH, {withFileTypes: true})
    const mappedCompanyEntries = companyDirEntries.map((companyDirEntry) => {
        const {name, parentPath} = companyDirEntry
        const companyFileName = name.split(".").slice(0, -1).join(".")
        const companyImageUrl = (parentPath + "/" + name).slice("public/".length)

        const {companyName, companyCompensation} = getCompanyDetailsFromFileName(companyFileName)

        return {
            companyName,
            companyCompensation,
            companyImageUrl,
        }
    })

    const sortedCompanyEntries = mappedCompanyEntries.toSorted((lhs, rhs) => {
        const cmp = lhs.companyName.localeCompare(rhs.companyName)
        if (cmp !== 0){
            return cmp
        }
        return lhs.companyCompensation - rhs.companyCompensation
    })

    return sortedCompanyEntries
}