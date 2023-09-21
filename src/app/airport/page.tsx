"use client"

import React, { useEffect, useState } from "react"
// import { useLocation } from "react-router-dom";
import { usePathname } from "next/navigation"
import { CustomProvider } from "rsuite"
import backgroundImage from "@/../public/images/mika-baumeister-DHlZenOMjJI-unsplash.jpg"
import HeroSection from "@/components/HeroSection"
import AirportsList from "@/components/Airport//AirportsList"
import { useFetchAirportsWithGenericInputQuery } from "@/store"
import { useTheme } from "@/hooks/ThemeContext"

function Airports(state) {
  const darkMode = useTheme()

  // const backgroundImage = ""
  // const { pathname, state } = useLocation();
  const pathname = usePathname()

  const [userInput, setUserInput] = useState("")
  const [skipRender, setSkipRender] = useState(true)
  const [page, setPage] = useState(1)
  const [airportData, setAirportData] = useState()
  const message = "Airport information"
  const placeHolderMessage = "ICAO, IATA, Name, City ... "

  // take input results from the Navbar and make the search
  useEffect(() => {
    if (pathname === "/airport" && state?.userInput) {
      setUserInput(state.userInput)
      setSkipRender(false)
    }
  }, [state?.userInput])

  const { data, error, isFetching } = useFetchAirportsWithGenericInputQuery(
    { searchTerm: userInput, page, limit: 10 },
    {
      skip: skipRender,
      refetchOnMountOrArgChange: true,
    }
  )

  useEffect(() => {
    if (data) {
      setAirportData(data)
    }
  }, [data])

  useEffect(() => {
    if (airportData) {
      localStorage.setItem("airportListData", JSON.stringify(airportData))
    }
  }, [airportData])

  let renderedAirport

  const onGoToPage = (inputPage: number) => {
    setPage(inputPage)
  }
  useEffect(() => {
    const data = localStorage.getItem("airportListData")
    if (data!==null) {
        const localData = JSON.parse(data)
        renderedAirport = (
        <AirportsList airports={localData} goToPage={onGoToPage} />
        )
    }
  }, [])

  if (data) {
    renderedAirport = <AirportsList airports={data} goToPage={onGoToPage} />
  } else if (isFetching) {
    renderedAirport = <div className="text-lg text-center">Loading...</div>
  } else if (error) {
    renderedAirport = (
      <div className="text-center">
        <h3>Error</h3>
      </div>
    )
  } else {
    renderedAirport = (
      <div className="text-center text-xl">
        <h3>Enter search query</h3>
      </div>
    )
  }

  const handleOnSubmit = (input: string) => {
    setUserInput(input)
    setSkipRender(false)
    setPage(1)
  }

  return (
    <CustomProvider theme={darkMode ? "dark" : "light"}>
      <div>
        <HeroSection
          backgroundImage={backgroundImage}
          message={message}
          placedHoldMessage={placeHolderMessage}
          onSubmit={handleOnSubmit}
        />
        {renderedAirport}
      </div>
    </CustomProvider>
  )
}

export default Airports
