import ast
import requests
import itertools
from bs4 import BeautifulSoup
from langchain.agents import Tool
from deep_translator import GoogleTranslator

class WeatherTimeTool:
    def __init__(self, model):
        self.model = model
        self.location_dictionary = None
        self.tool = Tool(
            name = "Weather Time Tool",
            func=self.invoke,
            description="""Useful for when you want to find the weather information or time information for a given location mentioned by the user.
            You can only ask for one Information at a time. Either the Weather or the Time.
            You can iterate over if you want to ask for both the Weather and Time.
            """
            )
    

    def find_date_and_time(self, query):
        prompt = f"""You are a Helpful assistant who will be asked to tell the weather and time for a given GeoGraphical Location.
        You have to extract the geographical location from the user query and also what type of query it is.
        You have to return three pieces of information from the query.
            (1)The Country for the Geographical Location.
            (2)The City or State or Prefecture(Japan only) for the Geographical Location.
            (3)Weather the User Query is asking for the Weather or Time/Day.

            
        If the User Query mentions the to find the weather/time for just a Country, return the Country and the Capital City/State/Prefecture of that Country.
        If the User Query mentions the City/State/Prefecture,  Find the country from which these Cities/States/Prefectures are from and return the Country and the City/State/Prefecture.

        RULES FOR RETURNING THE COUNTRY
        Once the country has been successfull identified, match the country name from the following and return it as mentioned in here.
        {{
        'afghanistan','albania','algeria','angola','argentina','armenia','australia',
        'austria','azerbaijan','bahamas','bahrain','bangladesh','barbados','belarus',
        'belgium','belize','benin','bermuda','bhutan','biot','bolivia','bosnia-herzegovina',
        'botswana','brazil','brunei','bulgaria','burkina-faso','burundi','cambodia','cameroon',
        'canada','cape-verde','central-african-republic','chad','chile','china','colombia',
        'comoros','congo','congo-demrep','cook-islands','costa-rica','cote-divoire','croatia',
        'cuba','cyprus','czech-republic','denmark','djibouti','dominican-republic','ecuador',
        'egypt','el-salvador','equatorial-guinea','eritrea','estonia','ethiopia','falkland',
        'faroe','fiji','finland','france','gabon','gambia','georgia','germany','ghana','gibraltar',
        'greece','greenland','guadeloupe','guatemala','guinea','guinea-bissau','guyana','haiti',
        'honduras','hong-kong','hungary','iceland','india','indonesia','iran','iraq','ireland',
        'isle-of-man','israel','italy','jamaica','japan','jordan','kazakhstan','kazakstan','kenya',
        'kerguelen','kiribati','kuwait','kyrgyzstan','laos','latvia','lebanon','lesotho','liberia',
        'libya','lithuania','luxembourg','madagascar','malawi','malaysia','maldives','mali','malta',
        'marshall-islands','mauritania','mauritius','mexico','micronesia','moldova','monaco','mongolia',
        'montenegro','morocco','mozambique','myanmar','namibia','nauru','nepal','netherlands','new-zealand',
        'nicaragua','niger','nigeria','niue','north-korea','norway','oman','pakistan','palau','panama',
        'papua-new-guinea','paraguay','peru','philippines','pitcairn','poland','portugal','puerto-rico',
        'qatar','republic-of-macedonia','reunion','romania','russia','rwanda','samoa','sao-tome-and-principe',
        'saudi-arabia','senegal','serbia','seychelles','sierra-leone','singapore','slovakia','slovenia',
        'solomon-islands','somalia','south-africa','south-georgia-sandwich','south-korea','south-sudan',
        'spain','sri-lanka','sudan','suriname','swaziland','sweden','switzerland','syria','taiwan',
        'tajikistan','tanzania','thailand','timor-leste','togo','tokelau','tonga','trinidad-and-tobago',
        'tunisia','turkey','turkmenistan','tuvalu','uganda','uk','ukraine','united-arab-emirates','uruguay',
        'usa','uzbekistan','vanuatu','vatican-city-state','venezuela','vietnam','western-sahara','yemen','zambia',
        'zimbabwe'
        }}

        Example: 
        (1)If the Country identified is United States, return 'usa' as the country name.
        (2)If the Country identified is United Kingdom, return 'uk' as the country name.
        (3)If the country identified is South Korea, return 'south-korea' as the country name.

        
        RULE FOR RETURNING THE CITY/STATE/PREFECTURE
        Once the City/State/Prefecture has been identified, the name should be 
        (1)lowercased
        (2)If it contains spaces, replace the spaces with a hyphen.

        Example:
        (1)If the City identified is New York, return 'new-york' as the city name.
        (2)If the City identified is Los Angeles, return 'los-angeles' as the city name.
        (3)If the City identified is San Francisco, return 'san-francisco' as the city name.

        RULE FOR RETURNING THE INFORMATION TYPE:
        If the User Query mentions anything related to weather, return 'weather' as the information type.
        If the User Query mentions anything related to time, return 'worldclock' as the information type.
        
        Example:
        (1)If the Query is "What is the time in New York right now right here", return 'worldclock' as the information type.
        (2)if the Query is "Yo wagwan, What would be the weather in United States", return 'weather' as the information type.


        RETURN FORMAT
        Once the Country, City/State/Prefecture, information-type has been identified, return all three in the following format.
        ```python\n{{'country': country, 'sub-location': city/state/prefecture, 'information-type': weather/worldclock}}\n```
        Example:
        (1)"What is the time in New York right now right here",
        ```python\n{{'country':'usa', 'sub-location':'new-york', 'information-type':'worldclock'}}\n```
        (2)"Yo boss, What would be the weather in United States"
        ```python\n{{'country':'usa', 'sub-location':'washington-dc', 'information-type':'weather'}}\n```
        (3)"What would be the time in the other side of the world that is Tokyo"
        ```python\n{{'country':'japan', 'sub-location':'tokyo', 'information-type':'worldclock'}}\n```
        (4)"Is it cloudy right now in United Emirates"
        ```python\n{{'country':'united-arab-emirates', 'sub-location':'abu-dhabi', 'information-type':'weather'}}\n```
        (5)"You bruv, what is the time in Japan right now maaann?"
        ```python\n{{'country':'japan', 'sub-location':'tokyo', 'information-type':'worldclock'}}\n```

        Now Return the Country, the City/State/Prefecture in the dictionary format for the given query.
        Query: {query}
        Output: 
        """ 
        output = self.model.llm.invoke(prompt)
        # print(output)
        string_location_dictionary = output.content.split("```python\n")[-1].split("\n")[0]
        # print(string_location_dictionary)
        self.location_dictionary = ast.literal_eval(string_location_dictionary)
        return self.location_dictionary


        
    def fetch_time_info(self):
        print(self.location_dictionary)
        url = f"https://www.timeanddate.com/{self.location_dictionary['information-type']}/{self.location_dictionary['country']}/{self.location_dictionary['sub-location']}"
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        data = soup.find("div",id="qlook")
        time = data.find("span",class_="h1").get_text()
        standard_time = data.find("span",id="cta").find("a").get("title")
        date = data.find("span",id="ctdat").get_text()
        full_info = f"{time}, {standard_time}, {date}"
        
        final_time_info = GoogleTranslator(target='english').translate(full_info)
        return final_time_info


    def fetch_weather_info(self):
        url = f"https://www.timeanddate.com/{self.location_dictionary['information-type']}/{self.location_dictionary['country']}/{self.location_dictionary['sub-location']}"
        response = requests.get(url)

        soup = BeautifulSoup(response.content, 'html.parser')

        temp_weather_table = soup.find("div", id="qlook")
        sub_info_table = soup.find("div", class_="bk-focus__info")
        
        temperature = temp_weather_table.find("div", class_="h2").get_text().replace("\xa0", "") if temp_weather_table else 'No temperature data'
        
        temp_weather_rows = temp_weather_table.find_all("p") if temp_weather_table else []
        temp_weather_info = [item.replace("\xa0", "°C") for item in itertools.chain.from_iterable(row.get_text().split("°C") for row in temp_weather_rows)]
        
        sub_info_rows = sub_info_table.find_all("tr") if sub_info_table else []
        sub_info = [row.get_text().replace("\xa0", "") for row in sub_info_rows][3:]  # Adjust slice as needed
        
        final_weather_info = ", ".join(["Current Temperature: " + temperature] + temp_weather_info + sub_info)

        return final_weather_info


    def fetch_info(self):
        if self.location_dictionary['information-type'] == 'worldclock':
            return self.fetch_time_info()
        elif self.location_dictionary['information-type'] == 'weather':
            return self.fetch_weather_info()


    def invoke(self, query):
        self.find_date_and_time(query)
        return self.fetch_info()
    

