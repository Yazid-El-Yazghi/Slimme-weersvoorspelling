package be.ehb.slimmeweervoospelling.Controllers;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebsiteController {

    @GetMapping("/")
    public String weer() {
        return "weer";
    }
    @GetMapping("/History")
    public String History() {
        return "History";
    }
    @GetMapping("/weer")
    public String weerPage() {
        return "weer";
    }
    @GetMapping("/Maandoverzicht")
    public String Maandoverzicht() {
        return "Maandoverzicht";
    }
}