package be.ehb.slimmeweervoospelling.Controllers;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
@Controller
public class WebsiteController {
    @GetMapping("/")
    public String home() {
        return "index"; // laadt index.html vanuit templates
    }
    @GetMapping("/admin")
    public String adminDashboard() {
        return "AdminIndex"; // laadt AdminIndex.html
    }
    @GetMapping("/alerts")
    public String alertsBeheer() {
        return "AlertsBeheer";
    }
    @GetMapping("/users")
    public String userBeheer() {
        return "AccountBeheer";
    }
    @GetMapping("/account")
    public String account() {
        return "Account";
    }

    @GetMapping("/new-account")
    public String newAccount() {
        return "NieuwAccount";
    }
    @GetMapping("/weer")
    public String voorspelling() {
        return "weer";
    }
}
