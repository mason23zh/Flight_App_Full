"use client"
/*
 Detailed airport information triggered by clicking "Go to Airport" button
 in AirportAccordion
 * */
import React, { useEffect, useState } from "react"
import axios from "axios"
import { CustomProvider } from "rsuite"
import { useRouter } from "next/navigation"
// import AirportMap from "@/components/Airport/AirportMap"

import dynamic from "next/dynamic"
const AirportMap = dynamic(() => import("@/components/Airport/AirportMap"), { ssr:false })

import AirportDetailNameSection from "@/components/AirportDetail/AirportDetailNameSection"
// import AirportDetailTable from "@/components/AirportDetail/AirportDetailTable"
// import AirportDetailRunwayTable from "@/components/AirportDetail/AirportDetailRunwayTable"
import AirportDetailWeatherSection from "@/components/AirportDetail/AirportDetailWeatherSection"
import AirportDetailTrafficWidget from "@/components/AirportDetail/AirportDetailTrafficWidget"
// import AirportDetailPanel from "@/components/AirportDetail/AirportDetailPanel"
import { useFetchDetailAirportWithICAO_WidgetQuery } from "@/store"
import { useTheme } from "@/hooks/ThemeContext"
import AtisSection from "@/components/ATIS/AtisSection"
import NoMatch from "@/components/NoMatch"

// import { useSearchParams } from 'next/navigation'

function AirportDetail({ params }: { params: { code: string } }) {

  // const searchParams = useSearchParams()
  // const icao = searchParams.get('icao')

  const darkMode = useTheme()
  //  const navigate = useNavigate();
  const router = useRouter()
  const [airport, setAirport] = useState<Airport>()
  const [metar, setMetar] = useState({})
  const [skipRender, setSkipRender] = useState(true)
  const [widgetAvailable, setWidgetAvailable] = useState(false)
  const [ATIS, setATIS] = useState()
  const [isLoading, setIsLoading] = useState(true)
  setTimeout(() => setIsLoading(false), 5000)

  const { code: ICAO } = params

  //  useEffect(() => {
  //      if (!localStorage.getItem("airportData")) {
  //          navigate("/");
  //      }
  //  });

  // Update airport visited count

  useEffect(() => {
    if (airport && airport.ICAO?.length !== 0) {
      const updateVisited = async (icao: string) => {
        await axios.put(
          "https://flight-data.herokuapp.com/api/v1/airports/update-visited",
          { icao: `${icao}` }
        )
      }
      updateVisited(airport.ICAO)
    }
  }, [ICAO])

  // get localStorage airport data
  useEffect(() => {
    const data = localStorage.getItem("airportData")
    if (!data) return

    const airportData = JSON.parse(data)
    if (airportData && !airportData?.flag) {
      setAirport(airportData)
      setSkipRender(false)
    } else if (airportData && airportData.flag === true) {
      const requestAirport = async (storageICAO: string) => {
        try {
          const response = await axios.get(
            `https://flight-data.herokuapp.com/api/v1/airports/icao/${storageICAO}?decode=true`
          )
          if (response) {
            setAirport(response.data.data[0].airport)
          }
        } catch (e) {
          console.log(e)
        }
      }
      requestAirport(airportData.ICAO).catch(console.error)
      setSkipRender(false)
    }
  }, [])

  // !this is a redundant request, but needed to be here because we need to check the widget availability
  // !from the server, and passing wind data to Runway Table
  // !code refactor required
  const {
    data: widgetData,
    error: widgetError,
    isFetching: widgetFetching,
  } = useFetchDetailAirportWithICAO_WidgetQuery(
    { icao: airport?.ICAO, decode: true },
    {
      skip: skipRender,
      refetchOnMountOrArgChange: true,
    }
  )

  useEffect(() => {
    if (widgetData) {
      if (widgetData.results > 0) {
        // check widget
        if (!widgetData.data[0].widget || widgetData.data[0].widget === false) {
          setWidgetAvailable(false)
        } else {
          setWidgetAvailable(true)
        }

        // check METAR
        if (widgetData.data[0].METAR) {
          setMetar(widgetData.data[0].METAR)
        }

        // check ATIS
        if (widgetData.data[0].ATIS) {
          setATIS(widgetData.data[0].ATIS)
        }
      }
    }
  }, [widgetData])

  //  const renderWidget = () => {
  //      if (widgetAvailable) {
  //          return (
  //              <div className="mt-5 w-full tableShrinkAgain:w-[1000px] transform transition-all ease-in-out duration-300">
  //                  <AirportDetailTrafficWidget iata={airport.iata} airportName={airport.station.name} />
  //              </div>
  //          );
  //      }
  //  };

  const themeMode = darkMode ? "dark" : "light"
  if (airport) {
    const { country_code, country_name } = airport.station.country
    const { region_name } = airport.station.region
    const { name } = airport.station
    //  const { type, home_link, wikipedia_link } = airport.additional;
    const { ICAO, iata, elevation, transitionAltitude } = airport
    const [lon, lat] = airport.station.geometry.coordinates

    return (
      <CustomProvider theme={themeMode}>
        <div className="p-3 grid grid-cols-1 items-center justify-items-stretch w-100%">
          <div className="mt-3 p-2 justify-self-center text-center ">
            <AirportDetailNameSection
              name={name}
              icao={ICAO}
              countryCode={country_code}
            />
          </div>
          <div className="mt-3 max-w-4xl ml-2 mr-2 p-2 justify-self-center text-center md:ml-0 md:mr-0">
            <AirportDetailWeatherSection icao={ICAO} />
          </div>
          <div className="mt-3 max-w-4xl ml-2 mr-2 p-2 justify-self-center text-center md:ml-0 md:mr-0">
            <AtisSection ATIS={ATIS} />
          </div>
          <div className="flex items-center justify-center w-full overflow-hidden mt-3 p-2">
            <div className="">
              <AirportMap lat={lat} lng={lon} name={name} />
            </div>
          </div>

          {/* <div className="mt-3 w-[100%] md:w-[70%] ml-2 mr-2 p-2 justify-self-center text-center md:ml-0 md:mr-0">
                         <div className="w-auto">
                             <AirportDetailPanel
                                 ICAO={ICAO}
                                 iata={iata}
                                 region={region_name}
                                 country={country_name}
                                 runwayCount={airport.runways.length}
                                 airportType={type}
                                 elevation={elevation}
                                 transitionAltitude={transitionAltitude}
                                 lng={lng}
                                 lat={lat}
                                 homeLink={home_link}
                                 wikiLink={wikipedia_link}
                             />
                         </div>
                     </div> */}
          {/*                      
                     <div className="mt-3 p-2 max-w-[1230px] w-[90%] justify-self-center">
                         <AirportDetailRunwayTable runways={airport.runways} metar={metar} />
                     </div> */}

          {/* <div className="ml-3 mr-3 p-2 justify-self-center">{renderWidget()}</div> */}
          <div className="ml-3 mr-3 p-2 justify-self-center">
            {widgetAvailable && (
              <div className="mt-5 transform transition-all ease-in-out duration-300">
                <AirportDetailTrafficWidget
                  iata={airport.iata}
                  airportName={airport.station.name}
                />
              </div>
            )}
          </div>
        </div>
      </CustomProvider>
    )
  }
  return (
    <div>
      {!isLoading ? <NoMatch /> : <div className="text-center">Loading...</div>}
    </div>
  )
}

export default AirportDetail
