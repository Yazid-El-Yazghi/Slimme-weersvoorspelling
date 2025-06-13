package be.ehb.slimmeweervoospelling.model;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

// Klasse die neerslaggegevens ophaalt via een externe API voor elk maand van het jaar 2025
public class APi {

    // Methode die de totale neerslag per maand in 2025 ophaalt en teruggeeft als lijst van doubles
    public static List<Double> getNeerslagPerMaand2025() {
        List<Double> maandTotalen = new ArrayList<>();

        try {
            HttpClient client = HttpClient.newHttpClient(); // HTTP-client aanmaken
            LocalDate today = LocalDate.now();
            int currentYear = today.getYear();

            // Als het nog geen 2025 is, geen data ophalen
            if (currentYear < 2025) return maandTotalen;

            // Bepaal tot welke maand er data moet worden opgehaald
            int laatsteMaand = (currentYear == 2025) ? today.getMonthValue() - 1 : 12;

            // Als er nog geen volledige maand is voorbijgegaan, stop
            if (laatsteMaand < 1) return maandTotalen;

            // Voor elke maand tot de laatste beschikbare maand
            for (int maand = 1; maand <= laatsteMaand; maand++) {
                YearMonth ym = YearMonth.of(2025, maand);
                LocalDate start = ym.atDay(1);
                LocalDate end = ym.atEndOfMonth();

                // Bouw de CQL-filter voor de API-oproep
                String cqlFilter = String.format(
                        "code = 6476 AND timestamp DURING %sT00:00:00Z/P%dD",
                        start, end.getDayOfMonth()
                );

                // Encodeer de filter voor gebruik in de URL
                String encodedFilter = URLEncoder.encode(cqlFilter, StandardCharsets.UTF_8);

                // API URL opbouwen
                String url = "https://opendata.meteo.be/service/ows" +
                        "?service=wfs" +
                        "&version=2.0.0" +
                        "&request=getFeature" +
                        "&typeNames=synop:synop_data" +
                        "&outputformat=json" +
                        "&CQL_FILTER=" + encodedFilter;

                // HTTP GET-request opbouwen en verzenden
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .GET()
                        .build();
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

                // JSON-respons verwerken
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(response.body());
                JsonNode features = root.get("features");

                double maandTotaal = 0.0;

                // Loop door alle features en tel neerslag op
                for (JsonNode feature : features) {
                    JsonNode props = feature.get("properties");
                    JsonNode neerslagNode = props.get("precip_quantity");

                    if (!neerslagNode.isNull()) {
                        maandTotaal += neerslagNode.asDouble();
                    }
                }

                // Afronden op 1 decimaal en toevoegen aan lijst
                maandTotalen.add(Math.round(maandTotaal * 10.0) / 10.0);
            }
        } catch (Exception e) {
            // Fouten worden genegeerd (geen logging aanwezig)
        }

        // Retourneer de lijst met neerslagtotalen
        return maandTotalen;
    }
}