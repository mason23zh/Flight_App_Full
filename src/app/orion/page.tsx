'use client'

import React from "react"
import PhotoAlbum, { RenderPhotoProps } from "react-photo-album"
import { CustomProvider } from "rsuite"
import photos from "@/utils/orionPhotos"
import { useTheme } from "@/hooks/ThemeContext"

import Image from "next/image"

function NextJsImage({
  photo,
  imageProps: { alt, title, sizes, className, onClick },
  wrapperStyle,
}: RenderPhotoProps) {
  return (
    <div style={{ ...wrapperStyle, position: "relative" }}>
      <Image
        fill
        src={photo}
        placeholder={"blurDataURL" in photo ? "blur" : undefined}
        {...{ alt, title, sizes, className, onClick }}
      />
    </div>
  )
}

function Orion() {
  const darkMode = useTheme()
  return (
    <CustomProvider theme={darkMode ? "dark" : "light"}>
      <div>
        <div className="text-center text-2xl md:text-3xl">
          Congrats! You found Orion!
        </div>
        <div className="px-8 py-5">
          <PhotoAlbum
            photos={photos}
            layout="columns"
            renderPhoto={NextJsImage}
          />
        </div>
      </div>
    </CustomProvider>
  )
}

export default Orion
