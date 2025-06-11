package be.ehb.slimmeweervoospelling.Controllers;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebsiteController {
    @GetMapping("/")
    public String weer() {
        return "weer"; // toont de voorspellingen
    }

    @GetMapping("/admin")
    public String adminDashboard() {
        return "Admin/AdminIndex"; // laadt Admin/AdminIndex.html
    }

    @GetMapping("/alerts")
    public String alertsBeheer() {
        return "Admin/AlertsBeheer"; // laadt Admin/AlertsBeheer.html
    }

    @GetMapping("/users")
    public String userBeheer() {
        return "Admin/AccountBeheer"; // laadt Admin/AccountBeheer.html
    }

    @GetMapping("/account")
    public String account() {
        return "Account"; // laadt Account.html
    }

    @GetMapping("/new-account")
    public String newAccount() {
        return "Admin/NieuwAccount"; // laadt Admin/NieuwAccount.html
    }

    @GetMapping("/index")
    public String index() {
        return "index"; // laadt index.html
    }
}
