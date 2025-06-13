package be.ehb.slimmeweervoospelling.Controllers;

import be.ehb.slimmeweervoospelling.Services.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
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
}