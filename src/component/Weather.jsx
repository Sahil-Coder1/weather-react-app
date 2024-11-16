import "../component/Weather.css";
import logo from "../images/t.png";
import humidity from "../images/humidity.png";
import precipitation from "../images/precipitation.png";
import wind from "../images/wind.png";
import pressure from "../images/pressure.png";
import marker from "../images/marker.png";
import { useEffect, useState } from "react";

const Weather = () => {
  const [inputValue, setInputValue] = useState(" ");
  const [weatherData, setWeather] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isToggle, setIsToggle] = useState(false);
  const [aiResponse, setaiResponse] = useState([]);

  const baseURL = import.meta.env.VITE_AI_API;
  const apiKey = import.meta.env.VITE_AI_API_KEY;
  let userPrompt = `give a 20-word health advisory focused on hydration, respiratory health, and heat by analyzing this data : \n`;

  const resp = async (prompt) => {
    const data = await fetch(baseURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompt),
    });
    setaiResponse(await data.json());
  };

  const API = import.meta.env.VITE_AI_WEATHER_API;
  const fetchWeather = async (query) => {
    setIsToggle(false);
    try {
      const response = await fetch(`${API}&q=${query}`);
      const data = await response.json();
      setWeather(data);
      if (data && data.current) {
        userPrompt += ` Temperature: (${data.current.temp_c}°C),Precipitation: (${data.current.precip_mm} mm), Pressure: (${data.current.pressure_in} in), Wind Speed: (${data.current.wind_kph} kph), Humidity: ${data.current.humidity}%`;
        userPrompt += `Please provide weather details for India based on the following seasonal data:
Winter (December to February): Northern India 5-25°C (41-77°F), Southern India 20-30°C (68-86°F)
Summer (March to May): Northern India 30-45°C (86-113°F), Southern India 30-40°C (86-104°F)
Monsoon (June to September): Northern India 25-35°C (77-95°F), Southern India 25-30°C (77-86°F)
Post-Monsoon (October to November): Northern India 20-30°C (68-86°F), Southern India 25-30°C (77-86°F) Please give your response in 20 to 25 words only`;
        console.log(userPrompt);

        let weatherDataa = {
          model: "meta-llama/Llama-Vision-Free",
          messages: [
            {
              role: "user",
              content: userPrompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 25,
          top_p: 0.7,
          top_k: 50,
          repetition_penalty: 1,
          stop: ["<|eot_id|>", "<|eom_id|>"],
          stream: false,
        };

        resp(weatherDataa);
      } else {
        console.log("Current not found");
      }
    } catch (error) {
      console.error("Error Fetching the Data : ", error);
    }
  };

  const getLocation = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeather(`${lat},${lon}`);
  };

  const handleAutocomplete = () => {
    const regex = new RegExp(inputValue, "i");
    const matches = options.filter((option) => regex.test(option));
    setSuggestions(matches);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getLocation);
    } else {
      console.log("not supported geolocation");
    }
  }, []);

  return (
    <div className="main">
      <div className="head">
        <img src={logo} alt="logo" className="logo-icon" />
        <div className="web-name"> ClimateTown </div>
        <div className="locationNow">
          <img src={marker} alt="" />
          <p>
            {weatherData
              ? `${weatherData.location.name}, ${weatherData.location.country}`
              : null}
          </p>
        </div>
      </div>

      <div className="search">
        <input
          id="autocomplete"
          className="autocomplete"
          type="text"
          placeholder="Search ..."
          value={inputValue}
          onClick={() => setIsToggle(true)}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleAutocomplete();
          }}
        />
        {isToggle && suggestions.length > 0 && (
          <div className="option">
            <ul type="none">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() =>
                    fetchWeather(suggestion) && setInputValue(suggestion)
                  }
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Weather details */}
      <div className="details">
        <div className="current">
          <div className="current-sub1">
            <p>Current Climate</p>
            <img
              src={weatherData ? weatherData.current.condition.icon : logo}
              alt="temp"
              className="temp"
            />
          </div>
          <div className="temp-now">
            <p>{weatherData ? `${weatherData.current.temp_c}°C` : null}</p>
          </div>
          <div className="feelslike">
            <p>
              Feels Like{" "}
              {weatherData
                ? `${weatherData.current.feelslike_c}°C in ${weatherData.location.name}`
                : null}
            </p>
          </div>
        </div>

        <div className="others">
          <table cellPadding="8">
            <tbody>
              <tr>
                <td colSpan="2">
                  <div className="note">
                    <p className="heading1">Condition</p>
                    <p>
                      {aiResponse &&
                      aiResponse.choices &&
                      aiResponse.choices[0].message
                        ? aiResponse.choices[0].message.content
                        : "Analyzing ..."}
                    </p>
                  </div>
                </td>
                <td>
                  <div className="precipitation">
                    <h1>Precipitation</h1>
                    <div className="detail-info">
                      <img
                        src={precipitation}
                        alt="precipitation"
                        className="small-icon"
                      />
                      <p>
                        {weatherData
                          ? `${weatherData.current.precip_mm}%`
                          : null}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="precipitation">
                    <h1>Pressure</h1>
                    <div className="detail-info">
                      <img
                        src={pressure}
                        alt="pressure"
                        className="small-icon"
                      />
                      <p>
                        {weatherData ? weatherData.current.pressure_in : null}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="precipitation">
                    <h1>Wind</h1>
                    <div className="detail-info">
                      <img src={wind} alt="wind" className="small-icon" />
                      <p className="detail-info-2">
                        {weatherData
                          ? `${weatherData.current.wind_kph}km`
                          : null}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="precipitation">
                    <h1>Humidity</h1>
                    <div className="detail-info">
                      <img
                        src={humidity}
                        alt="humidity"
                        className="small-icon"
                      />
                      <p>
                        {weatherData
                          ? `${weatherData.current.humidity} %`
                          : null}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
var options = [
  "Andhra Pradesh",
  "Anantapur",
  "Chittoor",
  "East Godavari",
  "Guntur",
  "Krishna",
  "Kurnool",
  "Prakasam",
  "Srikakulam",
  "Visakhapatnam",
  "Vizianagaram",
  "West Godavari",
  "YSR Kadapa",
  "Arunachal Pradesh",
  "Anjaw",
  "Changlang",
  "Dibang Valley",
  "East Kameng",
  "East Siang",
  "Kamle",
  "Kra Daadi",
  "Kurung Kumey",
  "Lower Dibang Valley",
  "Lower Siang",
  "Lower Subansiri",
  "Lohit",
  "Longding",
  "Namsai",
  "Pakke-Kessang",
  "Papum Pare",
  "Siang",
  "Tawang",
  "Tirap",
  "Upper Siang",
  "Upper Subansiri",
  "West Kameng",
  "West Siang",
  "Assam",
  "Baksa",
  "Barpeta",
  "Biswanath",
  "Bongaigaon",
  "Cachar",
  "Charaideo",
  "Chirang",
  "Darrang",
  "Dhemaji",
  "Dhubri",
  "Dibrugarh",
  "Goalpara",
  "Golaghat",
  "Hailakandi",
  "Hojai",
  "Jorhat",
  "Kamrup Metropolitan",
  "Kamrup Rural",
  "Karbi Anglong",
  "Karimganj",
  "Kokrajhar",
  "Lakhimpur",
  "Majuli",
  "Morigaon",
  "Nagaon",
  "Nalbari",
  "Odalguri",
  "Sivasagar",
  "Sonitpur",
  "Tamulpur",
  "Tinsukia",
  "Udalguri",
  "Bihar",
  "Araria",
  "Arwal",
  "Aurangabad",
  "Banka",
  "Begusarai",
  "Bhagalpur",
  "Bhojpur",
  "Buxar",
  "Darbhanga",
  "East Champaran",
  "Gaya",
  "Gopalganj",
  "Jamui",
  "Jehanabad",
  "Kaimur",
  "Katihar",
  "Khagaria",
  "Kishanganj",
  "Lakhisarai",
  "Madhepura",
  "Madhubani",
  "Munger",
  "Muzaffarpur",
  "Nalanda",
  "Nawada",
  "Patna",
  "Purnia",
  "Rohtas",
  "Saharsa",
  "Samastipur",
  "Saran",
  "Sheikhpura",
  "Sheohar",
  "Sitamarhi",
  "Siwan",
  "Supaul",
  "Vaishali",
  "Chhattisgarh",
  "Balod",
  "Baloda Bazar",
  "Balrampur",
  "Bastar",
  "Bemetara",
  "Bijapur",
  "Bilaspur",
  "Dantewada",
  "Dhamtari",
  "Durg",
  "Gariaband",
  "Gaurela Pendra Marwahi",
  "Janjgir-Champa",
  "Jashpur",
  "Kabirdham (formerly Kawardha)",
  "Kanker",
  "Kondagaon",
  "Korba",
  "Koriya",
  "Mahasamund",
  "Mungeli",
  "Narayanpur",
  "Raigarh",
  "Raipur",
  "Rajnandgaon",
  "Sukma",
  "Surajpur",
  "Surguja",
  "Goa",
  "North Goa",
  "South Goa",
  "Gujarat",
  "Ahmedabad",
  "Amreli",
  "Anand",
  "Aravalli",
  "Banaskantha",
  "Bharuch",
  "Bhavnagar",
  "Botad",
  "Chhota Udaipur",
  "Dahod",
  "Dang",
  "Devbhoomi Dwarka",
  "Gandhinagar",
  "Gir Somnath",
  "Jamnagar",
  "Junagadh",
  "Kachchh",
  "Kheda",
  "Mahisagar",
  "Mehsana",
  "Morbi",
  "Narmada",
  "Navsari",
  "Panchmahal",
  "Patan",
  "Porbandar",
  "Rajkot",
  "Sabarkantha",
  "Surat",
  "Surendranagar",
  "Tapi",
  "Vadodara",
  "Valsad",
  "Haryana",
  "Ambala",
  "Bhiwani",
  "Charkhi Dadri",
  "Faridabad",
  "Fatehabad",
  "Gurugram",
  "Hisar",
  "Jhajjar",
  "Jind",
  "Kaithal",
  "Karnal",
  "Kurukshetra",
  "Mahendragarh",
  "Nuh",
  "Palwal",
  "Panchkula",
  "Panipat",
  "Rewari",
  "Rohtak",
  "Sirsa",
  "Sonipat",
  "Yamunanagar",
  "Himachal Pradesh",
  "Bilaspur",
  "Chamba",
  "Hamirpur",
  "Kangra",
  "Kinnaur",
  "Lahaul and Spiti",
  "Mandi",
  "Shimla",
  "Solan",
  "Sirmaur",
  "Una",
  "Jharkhand",
  "Bokaro",
  "Chatra",
  "Deoghar",
  "Dhanbad",
  "Dumka",
  "East Singhbhum",
  "Garhwa",
  "Godda",
  "Gumla",
  "Hazaribagh",
  "Jamtara",
  "Khunti",
  "Latehar",
  "Lohardaga",
  "Pakur",
  "Palamu",
  "Ramgarh",
  "Ranchi",
  "Sahibganj",
  "Seraikela Kharsawan",
  "Simdega",
  "West Singhbhum",
  "Karnataka",
  "Bagalkot",
  "Ballari (Bellary)",
  "Belagavi (Belgaum)",
  "Bengaluru City",
  "Bengaluru Rural",
  "Bidar",
  "Chamarajanagara",
  "Chikkaballapura",
  "Chikkamagaluru (Chikmagalur)",
  "Chitradurga",
  "Dakshina Kannada",
  "Davangere",
  "Dharwad",
  "Gadag",
  "Hassan",
  "Haveri",
  "Kalburgi (Gulbarga)",
  "Kodagu",
  "Kolar",
  "Koppal",
  "Mandya",
  "Mysuru (Mysore)",
  "Raichur",
  "Ramanagara",
  "Shivamogga (Shimoga)",
  "Tumakuru (Tumkur)",
  "Udupi",
  "Vijayapura (Bijapur)",
  "Yadgir",
  "Kerala",
  "Alappuzha",
  "Ernakulam",
  "Idukki",
  "Kannur",
  "Kasaragod",
  "Kollam",
  "Kottayam",
  "Kozhikode",
  "Malappuram",
  "Palakkad",
  "Pathanamthitta",
  "Thiruvananthapuram",
  "Thrissur",
  "Wayanad",
  "Madhya Pradesh",
  "Agar Malwa",
  "Alirajpur",
  "Anuppur",
  "Ashoknagar",
  "Balaghat",
  "Barwani",
  "Betul",
  "Bhind",
  "Bhopal",
  "Burhanpur",
  "Chhatarpur",
  "Chhindwara",
  "Damoh",
  "Datia",
  "Dewas",
  "Dhar",
  "Dindori",
  "Guna",
  "Gwalior",
  "Harda",
  "Hoshangabad",
  "Indore",
  "Jabalpur",
  "Jhabua",
  "Katni",
  "Khandwa",
  "Khargone",
  "Mandla",
  "Mandsaur",
  "Morena",
  "Narsinghpur",
  "Neemuch",
  "Panna",
  "Raisen",
  "Rajgarh",
  "Ratlam",
  "Rewa",
  "Sagar",
  "Satna",
  "Sehore",
  "Seoni",
  "Shahdol",
  "Shajapur",
  "Sheopur",
  "Shivpuri",
  "Sidhi",
  "Singrauli",
  "Tikamgarh",
  "Ujjain",
  "Umaria",
  "Vidisha",
  "Maharashtra",
  "Ahmednagar",
  "Akola",
  "Amravati",
  "Aurangabad",
  "Beed",
  "Bhandara",
  "Buldhana",
  "Chandrapur",
  "Gadchiroli",
  "Gondia",
  "Hingoli",
  "Jalgaon",
  "Jalna",
  "Kolhapur",
  "Latur",
  "Mumbai City",
  "Mumbai Suburban",
  "Nagpur",
  "Nanded",
  "Nandurbar",
  "Nashik",
  "Osmanabad",
  "Palghar",
  "Parbhani",
  "Pune",
  "Raigad",
  "Ratnagiri",
  "Sangli",
  "Satara",
  "Sindhudurg",
  "Solapur",
  "Thane",
  "Wardha",
  "Washim",
  "Yavatmal",
  "Manipur",
  "Bishnupur",
  "Chandel",
  "Imphal East",
  "Imphal West",
  "Jiribam",
  "Kakching",
  "Kamjong",
  "Kangpokpi",
  "Noney",
  "Pherzawl",
  "Senapati",
  "Tamenglong",
  "Thoubal",
  "Ukhrul",
  "Meghalaya",
  "East Garo Hills",
  "East Khasi Hills",
  "North Garo Hills",
  "Ri-Bhoi",
  "South Garo Hills",
  "South West Garo Hills",
  "West Garo Hills",
  "West Khasi Hills",
  "Mizoram",
  "Aizawl",
  "Champhai",
  "Kolasib",
  "Lawngtlai",
  "Lunglei",
  "Mamit",
  "Saiha",
  "Serchhip",
  "Nagaland",
  "Dimapur",
  "Kiphire",
  "Kohima",
  "Longleng",
  "Mokokchung",
  "Mon",
  "Peren",
  "Phek",
  "Tuensang",
  "Wokha",
  "Zunheboto",
  "Odisha",
  "Angul",
  "Balangir",
  "Balasore",
  "Bargarh",
  "Bhadrak",
  "Boudh",
  "Cuttack",
  "Deog",
];

const autocomplete = (req) => {
  const termRegex = new RegExp("^" + req, "i");
  const matches = options.filter((item) => termRegex.test(item));
  return matches;
};

export default Weather;
