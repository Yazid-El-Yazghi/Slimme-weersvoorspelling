package be.ehb.slimmeweervoospelling.Controllers;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebsiteController {
    @GetMapping("/")
    public String weer() {
        return "weer"; // toont de voorspellingen
    }

    @GetMapping("/index")
    public String index() {
        return "index"; // laadt index.html
    }

    @GetMapping("/weer")
    public String weerPage() {
        return "weer"; // maakt /weer ook geldig
    }
}
