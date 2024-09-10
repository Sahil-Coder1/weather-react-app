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
    const [suggestions, setSuggestions] = useState([]);

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

    const handleAutocomplete = () => {
        const matches = autocomplete(inputValue);
        setSuggestions(matches);
        console.log(matches);
      };
      

    return (
        <div className='main'>
            <div className='head'>
                <img src={logo} alt='logo' className='logo-icon' />
                <div className='web-name'>ClimateTown</div>
                <div className="locationNow"><img src={marker} alt=''/><p>{weatherData ? weatherData.location.name+","+ weatherData.location.country : null}</p></div>
            </div>
            <div className='search'>
                <input
                id="autocomplete"
                className="autocomplete"
                    type='text'
                    placeholder='Search location'
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyUp={handleKeyPress}
                    onBlur={handleAutocomplete}
                />
                 {suggestions.length > 0 && (
        <div className="option">
            <ul type='none'>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={FetchD(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
        </div>
      )}
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
                                <p className="heading1">Condition</p>
                                    <p>{weatherData ? weatherData.current.condition.text : <p>.</p>}</p>
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

var options = ["Andhra Pradesh", "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa",
    "Arunachal Pradesh", "Anjaw", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Dibang Valley", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang",
    "Assam", "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong",
    "Bihar", "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran (Motihari)", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur (Bhabua)", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger (Monghyr)", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia (Purnea)", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran",
    "Chhattisgarh", "Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada (South Bastar)", "Dhamtari", "Durg", "Gariyaband", "Janjgir-Champa", "Jashpur", "Kabirdham (Kawardha)", "Kanker (North Bastar)", "Kondagaon", "Korba", "Korea (Koriya)", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja",
    "Goa", "North Goa", "South Goa",
    "Gujarat", "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha (Palanpur)", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dang (Ahwa)", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda (Nadiad)", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada (Rajpipla)", "Navsari", "Panchmahal (Godhra)", "Patan", "Porbandar", "Rajkot", "Sabarkantha (Himmatnagar)", "Surat", "Surendranagar", "Tapi (Vyara)", "Vadodara", "Valsad",
    "Haryana", "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurgaon", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Mewat", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar",
    "Himachal Pradesh", "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul & Spiti", "Mandi", "Shimla", "Sirmaur (Sirmour)", "Solan", "Una",
    "Jharkhand", "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribag", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj", "Seraikela-Kharsawan", "Simdega", "West Singhbhum",
    "Karnataka", "Bagalkot", "Ballari (Bellary)", "Belagavi (Belgaum)", "Bengaluru (Bangalore) Rural", "Bengaluru (Bangalore) Urban", "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru (Chikmagalur)", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi (Gulbarga)", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru (Mysore)", "Raichur", "Ramanagara", "Shivamogga (Shimoga)", "Tumakuru (Tumkur)", "Udupi", "Uttara Kannada (Karwar)", "Vijayapura (Bijapur)", "Yadgir",
    "Kerala", "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad",
    "Madhya Pradesh", "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa (East Nimar)", "Khargone (West Nimar)", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha",
    "Maharashtra", "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal",
    "Manipur", "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul",
    "Meghalaya", "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills",
    "Mizoram", "Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip",
    "Nagaland", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto",
    "Odisha", "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar (Keonjhar)", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Sonepur", "Sundargarh",
    "Punjab", "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "S.A.S. Nagar", "Sangrur", "Shaheed Bhagat Singh Nagar", "Sri Muktsar Sahib", "Tarn Taran",
    "Rajasthan", "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur",
    "Sikkim", "East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim",
    "Tamil Nadu", "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi (Tuticorin)", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar",
    "Telangana", "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhoopalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal (Rural)", "Warangal (Urban)", "Yadadri Bhuvanagiri",
    "Tripura", "Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura",
    "Uttar Pradesh", "Agra", "Aligarh", "Ambedkar Nagar", "Amethi (Chatrapati Sahuji Mahraj Nagar)", "Amroha (J.P. Nagar)", "Auraiya", "Ayodhya (Faizabad)", "Azamgarh", "Badaun", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur (Panchsheel Nagar)", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj (Kanshiram Nagar)", "Kaushambi", "Kushinagar (Padrauna)", "Lakhimpur - Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj (Allahabad)", "Raebareli", "Rampur", "Saharanpur", "Sambhal (Bhim Nagar)", "Sant Kabir Nagar", "Shahjahanpur", "Shamali (Prabuddh Nagar)", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi",
    "Uttarakhand", "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi",
    "West Bengal", "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur (South Dinajpur)", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Medinipur (West Medinipur)", "Paschim (West) Burdwan (Bardhaman)", "Purba Burdwan (Bardhaman)", "Purba Medinipur (East Medinipur)", "Purulia", "South 24 Parganas", "Uttar Dinajpur (North Dinajpur)"
];
const autocomplete = (req) => {
    const termRegex = new RegExp("^" + req, "i");
    const matches = options.filter(item => termRegex.test(item));
    return matches;
  };
export default Weather;
