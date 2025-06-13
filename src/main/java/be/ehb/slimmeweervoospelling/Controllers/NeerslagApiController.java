package be.ehb.slimmeweervoospelling.Controllers;

import be.ehb.slimmeweervoospelling.model.APi;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


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
