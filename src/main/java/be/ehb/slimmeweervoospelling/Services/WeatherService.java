package be.ehb.slimmeweervoospelling.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.Month;
import java.util.*;

@Service
public class WeatherService {
    private final RestTemplate restTemplate = new RestTemplate();
    private static final String API_URL = "https://api.open-meteo.com/v1/forecast?latitude=%s&longitude=%s&daily=precipitation_sum&timezone=Europe/Berlin";

    // Haalt weerdata op van de API (Open-Meteo API voor dagelijkse neerslag)
    public String getWeatherData(double latitude, double longitude) {
        String url = String.format(API_URL, latitude, longitude);
        return restTemplate.getForObject(url, String.class);
    }

    //Analyseert de opgehaalde weerdata en bepaalt of er overstromingsgevaar is ( deze gedeelte is meer gemaakt met chagpt omdat het redeelijk moeilijk was)
    public String analyzeFloodRisk(String jsonResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(jsonResponse);
            JsonNode daily = root.path("daily");
            if (daily.isMissingNode()) return "Geen data beschikbaar.";

            JsonNode times = daily.path("time");
            JsonNode precipitation = daily.path("precipitation_sum");
            if (!times.isArray() || !precipitation.isArray()) return "Geen data beschikbaar.";

            //Verzamel neerslag per maand
            Map<Month, Double> monthTotals = new HashMap<>();
            for (int i = 0; i < times.size(); i++) {
                LocalDate date = LocalDate.parse(times.get(i).asText());
                Month month = date.getMonth();
                double value = precipitation.get(i).asDouble(0);
                monthTotals.put(month, monthTotals.getOrDefault(month, 0.0) + value);
            }

            //Seizoenen en drempels voor overstromingsrisico
            Map<String, List<Month>> seasons = Map.of(
                    "Winter", List.of(Month.DECEMBER, Month.JANUARY, Month.FEBRUARY),
                    "Lente", List.of(Month.MARCH, Month.APRIL, Month.MAY),
                    "Zomer", List.of(Month.JUNE, Month.JULY, Month.AUGUST),
                    "Herfst", List.of(Month.SEPTEMBER, Month.OCTOBER, Month.NOVEMBER)
            );
            // Zet de standaard drempels terug (geen -1 meer)
            Map<String, Integer> thresholds = Map.of(
                    "Winter", 300,
                    "Lente", 250,
                    "Zomer", 260,
                    "Herfst", 280
            );

            StringBuilder result = new StringBuilder();
            //controleer per seizoen of de drempel is overschreden
            for (String season : seasons.keySet()) {
                double sum = 0;
                for (Month m : seasons.get(season)) {
                    sum += monthTotals.getOrDefault(m, 0.0);
                }
                if (sum >= thresholds.get(season)) {
                    result.append("⚠️ Gevaar voor overstroming in ").append(season)
                            .append(" (totaal: ").append(String.format("%.1f", sum))
                            .append(" mm, drempel: ").append(thresholds.get(season)).append(" mm)\n");
                }
            }
            if (result.length() == 0) return "Geen overstromingsgevaar gedetecteerd.";
            return result.toString();
        } catch (Exception e) {
            return "Fout bij analyseren van data.";
        }
    }
}