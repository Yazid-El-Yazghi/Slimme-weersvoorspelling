package be.ehb.slimmeweervoospelling.Controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import be.ehb.slimmeweervoospelling.model.APi;

// Controllers voor de webapplicatie:
// - WebsiteController toont webpagina's
// - NeerslagApiController levert neerslaggegevens in JSON-formaat via een REST API

// Controller voor het tonen van HTML-webpagina's
@Controller
public class WebsiteController {

    // Route voor de hoofdpagina ("/") die de "weer.html" view retourneert
    @GetMapping("/")
    public String weer() {
        return "weer";
    }

    // Route voor "/History", toont de "History.html" view
    @GetMapping("/History")
    public String History() {
        return "History";
    }

    // Alternatieve route voor "/weer", toont ook "weer.html"
    @GetMapping("/weer")
    public String weerPage() {
        return "weer";
    }
}

// REST API-controller die neerslaggegevens van 2025 aanbiedt
@RestController
class NeerslagApiController {

    // Endpoint: /api/neerslag/2025
    // Retourneert een JSON-object met neerslagdata per maand
    @RequestMapping("/api/neerslag/2025")
    @ResponseBody
    public Map<String, Object> getNeerslag2025() {
        Map<String, Object> result = new HashMap<>();

        // Haal de neerslagtotalen per maand op via de APi-klasse
        List<Double> maandData = APi.getNeerslagPerMaand2025();

        // Vul ontbrekende maanden aan met null zodat er altijd 12 waarden zijn
        while (maandData.size() < 12) {
            maandData.add(null);
        }

        // Plaats de data in een map onder de sleutel "data"
        result.put("data", maandData);

        // Geef de map terug als JSON-respons
        return result;
    }
}