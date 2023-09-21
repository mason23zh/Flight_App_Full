"use client"

import React from "react"
import { CustomProvider } from "rsuite"
import { useTheme } from "@/hooks/ThemeContext"

import SubRowAsync from "@/components/ExtremeWeather/SubRowAsync"
import WeatherTable from "@/components/ExtremeWeather/ExtremeWeatherTable"
import ExtremeWeatherHeroSection from "@/components/ExtremeWeather/ExtreamWeatherHeroSection"
import ExtremeWeatherHeaderDropDown from "@/components/ExtremeWeather/ExtremeWeatherHeaderDropDown"
import ExtremeWeatherHeader from "@/components/ExtremeWeather/ExtremeWeatherHeader"

function ExtremeWeather() {
  const darkMode = useTheme()
  const renderExpandedContent = React.useCallback(
    ({
      row,
    }: {
      row: {
        original: {
          icao: string
        }
      }
    }) => <SubRowAsync row={row} />,
    []
  )

  return (
    <>
      <CustomProvider theme={darkMode ? "dark" : "light"}>
        <div className={darkMode ? "bg-gray-400" : "bg-gray-200"}>
          <ExtremeWeatherHeroSection />
          <>
            <div className="hidden transition-all ease-in-out ExWeatherHeadMd:block">
              <ExtremeWeatherHeader />
            </div>
            <div className="transition-all ease-in-out ExWeatherHeadMd:hidden">
              <ExtremeWeatherHeaderDropDown />
            </div>
          </>
        </div>
        <div className="flex justify-center items-center p-5 ml-5 mr-5">
          <div className="overflow-auto">
            <WeatherTable expandedContent={renderExpandedContent} />
          </div>
        </div>
      </CustomProvider>
    </>
  )
}

export default ExtremeWeather
