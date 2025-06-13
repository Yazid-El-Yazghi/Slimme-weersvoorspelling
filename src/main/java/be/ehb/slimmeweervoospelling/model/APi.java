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

/**
 * Klasse voor het ophalen van neerslaggegevens via externe API's.
 * Bevat methodes om historische en actuele neerslagdata te verkrijgen.
 */
public class APi {
    /**
     * Haalt de neerslaggegevens per maand op voor het jaar 2025.
     * Maakt verbinding met de Meteologix API om de data te verkrijgen.
     * 
     * @return Een lijst met neerslaggegevens (in mm) voor elke maand van 2025 tot de huidige maand.
     *         Retourneert een lege lijst als het huidige jaar voor 2025 is.
     */
    public static List<Double> getNeerslagPerMaand2025() {
        List<Double> maandTotalen = new ArrayList<>();
        try {
            HttpClient client = HttpClient.newHttpClient();
            LocalDate today = LocalDate.now();
            int currentYear = today.getYear();
            if (currentYear < 2025) return maandTotalen;
            
            // Bepaal de laatste maand waarvoor we gegevens hebben
            int laatsteMaand = (currentYear == 2025) ? today.getMonthValue() - 1 : 12;
            if (laatsteMaand < 1) return maandTotalen;
            
            // Loop door elke maand tot de laatst beschikbare maand
            for (int maand = 1; maand <= laatsteMaand; maand++) {
                YearMonth ym = YearMonth.of(2025, maand);
                LocalDate start = ym.atDay(1);
                LocalDate end = ym.atEndOfMonth();
                
                // Bouw de CQL-filter voor de API-query
                String cqlFilter = String.format(
                        "code = 6476 AND timestamp DURING %sT00:00:00Z/P%dD",
                        start, end.getDayOfMonth()
                );
                String encodedFilter = URLEncoder.encode(cqlFilter, StandardCharsets.UTF_8);
                
                // Stel de API-URL samen
                String url = "https://opendata.meteo.be/service/ows" +
                        "?service=wfs" +
                        "&version=2.0.0" +
                        "&request=getFeature" +
                        "&typeNames=synop:synop_data" +
                        "&outputformat=json" +
                        "&CQL_FILTER=" + encodedFilter;
                
                // Voer het API-request uit
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .GET()
                        .build();
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                
                // Verwerk de JSON-respons
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(response.body());
                JsonNode features = root.get("features");
                
                // Bereken het maandelijkse totaal
                double maandTotaal = 0.0;
                for (JsonNode feature : features) {
                    JsonNode props = feature.get("properties");
                    JsonNode neerslagNode = props.get("precip_quantity");
                    if (!neerslagNode.isNull()) {
                        maandTotaal += neerslagNode.asDouble();
                    }
                }
                
                // Rond af op 1 decimaal en voeg toe aan de lijst
                maandTotalen.add(Math.round(maandTotaal * 10.0) / 10.0);
            }
        } catch (Exception e) {
            // Vang eventuele fouten op (logging zou hier kunnen worden toegevoegd)
        }
        return maandTotalen;
    }
}
