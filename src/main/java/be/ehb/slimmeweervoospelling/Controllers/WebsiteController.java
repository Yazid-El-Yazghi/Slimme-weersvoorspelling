package be.ehb.slimmeweervoospelling.Controllers;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// Deze controller regelt de navigatie tussen de hoofd- en indexpagina's van de webapplicatie
@Controller
public class WebsiteController {
    // Root route: toont standaard de weerpagina
    @GetMapping("/")
    public String weer() {
        return "weer";
    }

    // Route voor index: toont historische gegevens
    @GetMapping("/index")
    public String index() {
        return "index";
    }

    // Route voor weerpagina (optioneel, zelfde als root)
    @GetMapping("/weer")
    public String weerPage() {
        return "weer";
    }
}
