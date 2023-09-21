'use client'

import React from "react";
import { CustomProvider } from "rsuite";
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "@/hooks/ThemeContext";

function NoMatch() {
    const darkMode = useTheme();
    return (
        <CustomProvider theme={darkMode ? "dark" : "light"}>
            <div className="h-screen">
                <div className="flex flex-col items-center gap-5">
                    <div className="text-md text-center md:text-3xl">404 Not Found</div>
                    <div className="text-sm text-center md:text-lg">Looks like you are lost, wanna solve some
                        puzzles?
                    </div>
                    <div className="text-sm text-center md:text-md">Click image below to start finding Orion!</div>
                    <Link href="/puzzles">
                        <div className="h-[480px] w-[320px] md:h-[600px] md:w-[400px]">
                            <Image src="/images/404.png" width={480} height={320} alt="Orion Not Found" />
                        </div>
                    </Link>
                </div>
            </div>
        </CustomProvider>
    );
}

export default NoMatch;
