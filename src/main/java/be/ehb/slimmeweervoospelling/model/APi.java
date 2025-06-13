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

//api voor het ophalen van neerslaggegevens per maand in 2025
public class APi {
    public static List<Double> getNeerslagPerMaand2025() {
        List<Double> maandTotalen = new ArrayList<>();
        try {
            HttpClient client = HttpClient.newHttpClient();
            LocalDate today = LocalDate.now();
            int currentYear = today.getYear();
            if (currentYear < 2025) return maandTotalen;
            int laatsteMaand = (currentYear == 2025) ? today.getMonthValue() - 1 : 12;
            if (laatsteMaand < 1) return maandTotalen;
            for (int maand = 1; maand <= laatsteMaand; maand++) {
                YearMonth ym = YearMonth.of(2025, maand);
                LocalDate start = ym.atDay(1);
                LocalDate end = ym.atEndOfMonth();
                String cqlFilter = String.format(
                        "code = 6476 AND timestamp DURING %sT00:00:00Z/P%dD",
                        start, end.getDayOfMonth()
                );
                String encodedFilter = URLEncoder.encode(cqlFilter, StandardCharsets.UTF_8);
                String url = "https://opendata.meteo.be/service/ows" +
                        "?service=wfs" +
                        "&version=2.0.0" +
                        "&request=getFeature" +
                        "&typeNames=synop:synop_data" +
                        "&outputformat=json" +
                        "&CQL_FILTER=" + encodedFilter;
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(url))
                        .GET()
                        .build();
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(response.body());
                JsonNode features = root.get("features");
                double maandTotaal = 0.0;
                for (JsonNode feature : features) {
                    JsonNode props = feature.get("properties");
                    JsonNode neerslagNode = props.get("precip_quantity");
                    if (!neerslagNode.isNull()) {
                        maandTotaal += neerslagNode.asDouble();
                    }
                }
                maandTotalen.add(Math.round(maandTotaal * 10.0) / 10.0);
            }
        } catch (Exception e) {
        }
        return maandTotalen;
    }
}
