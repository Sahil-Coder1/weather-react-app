import "../component/Weather.css";
import logo from '../images/t.png';
import humidity from '../images/humidity.png';
import precipitation from '../images/precipitation.png';
import wind from '../images/wind.png';
import Pressure from '../images/pressure.png';
import { useEffect, useState } from "react";
import marker from "../images/marker.png";

const Weather = () => {
    const [inputValue, setInputValue] = useState("");
    const [weatherData, setWeather] = useState(null);

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            FetchD(inputValue);
        }
    }

    const getLocation = (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        FetchData(lat, lon);
    }

    const FetchData = async (lat, lon) => {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=f05fdd7091264238b5e74216240305&q=${lat},${lon}`);
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const FetchD = async (location) => {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=f05fdd7091264238b5e74216240305&q=${location}`);
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getLocation);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    return (
        <div className='main'>
            <div className='head'>
                <img src={logo} alt='logo' className='logo-icon' />
                <div className='web-name'>ClimateTown</div>
                <div className="locationNow"><img src={marker}/><p>{weatherData ? weatherData.location.name+","+ weatherData.location.country : null}</p></div>
            </div>
            <div className='search'>
                <input
                    type='text'
                    placeholder='Search location'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyUp={handleKeyPress}
                />
            </div>
            <div className='details'>
                <div className='current'>
                    <div className='current-sub1'>
                        <p>Current Climate</p><img src={weatherData ? weatherData.current.condition.icon: logo} alt='temp' className='temp' />
                    </div>
                    <div className='temp-now'>
                        <p>{weatherData ? weatherData.current.temp_c + "°C" : <p>.</p>}</p>
                    </div>
                    <div className='feelslike'>
                        <p>Feels Like {weatherData ? weatherData.current.feelslike_c + "°C in " +weatherData.location.name : <p>.</p>}</p>
                    </div>
                </div>
                <div className='others'>
                    <table cellPadding='8'>
                        <tr>
                            <td colSpan='2'>
                                <div className='note'>
                                    Stay indoors during peak sun hours, hydrate frequently, and avoid strenuous activities to prevent heatstroke and dehydration.
                                </div>
                            </td>
                            <td>
                                <div className='precipitation'>
                                    <h1>Precipitation</h1><br />
                                    <img src={precipitation} alt='precipitation' className='small-icon' />
                                    <p>{weatherData ? weatherData.current.precip_mm + "%" : <p>.</p>}</p>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className='precipitation'>
                                    <h1>Pressure</h1><br />
                                    <img src={Pressure} alt='precipitation' className='small-icon' />
                                    <p>{weatherData ? weatherData.current.pressure_in + "" : <p>.</p>}</p>
                                </div>
                            </td>
                            <td>
                                <div className='precipitation'>
                                    <h1>Wind</h1><br />
                                    <img src={wind} alt='precipitation' className='small-icon' />
                                    <p>{weatherData ? weatherData.current.wind_kph : <p>.</p>}<br /><h3>kph</h3></p>
                                </div>
                            </td>
                            <td>
                                <div className='precipitation'>
                                    <h1>Humidity</h1><br />
                                    <img src={humidity} alt='precipitation' className='small-icon' />
                                    <p>{weatherData ? weatherData.current.humidity : <p>.</p>}</p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Weather;
