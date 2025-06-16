package be.ehb.slimmeweervoospelling.Controllers;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// Deze controller regelt de navigatie tussen de hoofd- en indexpagina's van de webapplicatie
@Controller
public class WebsiteController {
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

    // Maandoverzicht route
    @GetMapping("/maandoverzicht")
    public String maandoverzicht() {
        return "Maandoverzicht";
    }
}