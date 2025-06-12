package be.ehb.slimmeweervoospelling.Controllers;

import be.ehb.slimmeweervoospelling.Services.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
public class WeatherController {

    @Autowired
    private WeatherService weatherService;


    //Deze mapping gaat de data van de API ophalen en de overstromingsrisico analyseren
    @GetMapping("/flood-risk")
    public String getFloodRisk(@RequestParam double latitude, @RequestParam double longitude) {
        String weatherData = weatherService.getWeatherData(latitude, longitude);
        return weatherService.analyzeFloodRisk(weatherData);
    }

    @RestController
    public static class weatherController {

        @Autowired
        private WeatherService weatherService;

        //Deze mapping gaat de data van de API ophalen en de overstromingsrisico analyseren
        @GetMapping("/flood-risk")
        public String getFloodRisk(@RequestParam double latitude, @RequestParam double longitude) {
            String weatherData = weatherService.getWeatherData(latitude, longitude);
            return weatherService.analyzeFloodRisk(weatherData);
        }
    }

    // Deze controller regelt de navigatie tussen de hoofd- en indexpagina's van de webapplicatie
    @Controller
    public static class WebsiteController {
        //route voor de weervoorspelling default page
        @GetMapping("/")
        public String weer() {
            return "weer";
        }

        //historische gegevens van 2005-2025 tot nu toe
        @GetMapping("/index")
        public String index() {
            return "index";
        }

        //
        @GetMapping("/weer")
        public String weerPage() {
            return "weer";
        }
    }
}

