package be.ehb.slimmeweervoospelling.Controllers;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import be.ehb.slimmeweervoospelling.model.APi;

/**
 * Controller voor de webpagina's van de applicatie.
 * Behandelt de routing naar de verschillende HTML-templates.
 */
@Controller
public class WebsiteController {
    /**
     * Verwerkt requests naar de hoofdpagina.
     * 
     * @return Naam van de template die gerenderd moet worden ("weer.html")
     */
    @GetMapping("/")
    public String weer() {
        return "weer";
    }

    /**
     * Verwerkt requests naar de historische gegevenspagina.
     * 
     * @return Naam van de template die gerenderd moet worden ("History.html")
     */
    @GetMapping("/History")
    public String History() {
        return "History";
    }

    /**
     * Verwerkt requests naar de weerpagina.
     * 
     * @return Naam van de template die gerenderd moet worden ("weer.html")
     */
    @GetMapping("/weer")
    public String weerPage() {
        return "weer";
    }
}

/**
 * RestController voor het afhandelen van API-requests voor neerslaggegevens.
 */
@RestController
class NeerslagApiController {
    /**
     * Verwerkt requests om neerslaggegevens voor 2025 te verkrijgen.
     * Haalt de gegevens op via de APi klasse en formatteert ze als een Map.
     * 
     * @return Map met neerslaggegevens voor 2025, met null-waarden voor ontbrekende maanden
     */
    @RequestMapping("/api/neerslag/2025")
    @ResponseBody
    public Map<String, Object> getNeerslag2025() {
        Map<String, Object> result = new HashMap<>();
        List<Double> maandData = APi.getNeerslagPerMaand2025();
        while (maandData.size() < 12) {
            maandData.add(null);
        }
        result.put("data", maandData);
        return result;
    }
}
