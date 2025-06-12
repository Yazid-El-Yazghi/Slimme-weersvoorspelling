package be.ehb.slimmeweervoospelling.Controllers;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import be.ehb.slimmeweervoospelling.model.APi;

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
}

@RestController
class NeerslagApiController {
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
