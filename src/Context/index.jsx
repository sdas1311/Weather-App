import { useContext,createContext,useState,useEffect } from "react";
import axios from "axios";
const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
    const [weather, setWeather] = useState({})
    const [values, setValues] = useState([])
    const [place, setPlace] = useState('Kolkata')
    const [thisLocation, setLocation] = useState('')

    // fetch api
    const fetchWeather = async () => {
        const options = {
            method: 'GET',
            url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
            params: {
                aggregateHours: '24',
                location: place,
                contentType: 'json',
                unitGroup: 'metric',
                shortColumnNames: 0,
            },
            headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_API_KEY,
                'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com'
              }
        }

        try {
            const response = await axios.request(options);
            console.log(response.data)
            const thisData = Object.values(response.data.locations)[0]
            setLocation(thisData.address)
            setValues(thisData.values)
            setWeather(thisData.values[0])
        } catch (e) {
            console.error(e);
        // Improved error logging
        if (e.response) {
            // Server responded with a status other than 200 range
            console.error("Response data:", e.response.data);
            console.error("Response status:", e.response.status);
            console.error("Response headers:", e.response.headers);
        } else if (e.request) {
            // Request was made but no response was received
            console.error("Request data:", e.request);
        } else {
            // Something happened in setting up the request
            console.error("Error message:", e.message);
        }
        alert('An error occurred while fetching the weather data. Check console for details.')
    }
    }
    useEffect(() => {
        fetchWeather()
    }, [place])

    useEffect(() => {
        console.log(values)
    }, [values])

    return (
        <StateContext.Provider value={{
            weather,
            setPlace,
            values,
            thisLocation,
            place
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext)