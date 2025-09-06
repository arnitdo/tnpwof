"use client"

import React from "react";

type ScreenSizeProps = {
    minWidth?: number,
    minHeight?: number,
    children: React.ReactNode,
}

export default function ScreenSize(props: ScreenSizeProps) {
    if (typeof window === "undefined") {
        return null
    }

    const {minWidth = window.innerWidth, minHeight = window.innerHeight, children} = props

    if (window.innerWidth < minWidth || window.innerHeight < minHeight) {
        return <p>Please switch to a screen of minimum {minWidth}x{minHeight}</p>
    }

    return children as React.ReactNode
}