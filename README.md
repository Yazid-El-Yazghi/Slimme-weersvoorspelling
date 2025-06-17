# Slimme Weersvoorspelling - Aquafin Overstroomingsrisicoanalyse

Een intelligente weersvoorspelling applicatie gebouwd met Spring Boot voor het Programming Project. Deze app is ontwikkeld voor Aquafin medewerkers om overstromingsrisico's te monitoren en weersvoorspellingen te bekijken voor heel Vlaanderen.

## Voor de eind gebruiker

### Weersvoorspelling Dashboard
- Real-time weersvoorspellingen voor 10 grote Vlaamse steden
- 7-dagen voorspelling met neerslag, temperatuur en windsnelheid
- Interactieve grafieken met Chart.js
- Selecteerbare gemeenten via checkboxes
- Tooltip informatie met gedetailleerde weerdata

### Overstromingsrisicoanalyse
- Seizoensgebonden overstromingsdrempels
- Automatische risicobeoordeling per gemeente
- Waarschuwingssysteem met visuele indicatoren
- Real-time monitoring van neerslagaccumulatie
- Kleurgecodeerde waarschuwingen (groen=veilig, rood=gevaar)

### Historische Data Analyse
- Historische neerslagdata van 2005-2024
- Maandelijkse neerslagstatistieken per jaar
- Seizoensgebonden overstromingsanalyse
- Interactieve jaarSelectie
- Real-time data voor 2025 via Meteo.be API
  
- ### NeerslagKaart
- Interactieve Neerslagkaart
- Toont neerslag informatie
- Vergroten/verkleinen
- Toont heel Vlaanderen

- ### Huidige weer op jouw locatie
- Op basis van geolocatie worden gegevens getoond van de dichtstbijzijnde gemeente.
- Kan gebruikt worden in heel Vlaanderen
- Locatie gebruiken toestaan
  

### Grafiek Infromatie
Ondersteuning voor 10 grote Vlaamse gemeenten:
- **Antwerpen**
- **Gent**
- **Brugge**
- **Leuven**
- **Mechelen**
- **Hasselt**
- **Kortrijk**
- **Oostende**
- **Aalst** 
- **Sint-Niklaas** 

## Screenshots

### Weersvoorspelling Dashboard
Het hoofddashboard toont de 7-dagen weersvoorspelling voor geselecteerde Vlaamse gemeenten met overstromingsrisicoanalyse.

![Weersvoorspelling Dashboard](Screenshots/weer.png)

### Historische Data Analyse
De historische pagina toont neerslagdata per maand met seizoensgebonden overstromingswaarschuwingen.

![Historische Data](Screenshots/History.png)

## extra features Neerslagkaart
De NeerslagKaart pagina toont een kaart van Vlaanderen die aantoont waar het zal regenen
![image](https://github.com/user-attachments/assets/dcd37b1c-f7b5-4cdc-996c-44420e8d643a)


## extra features MaandOverzicht per gemeente
Voor gebruikers die liever de hele maand voorspelling zien, een grafiek die de hele maand voorspelling heeft.
![Screenshot 2025-06-17 105849](https://github.com/user-attachments/assets/038bdb63-26fb-4c6f-bed5-a8c2aad6ec57)

## Voor de Developer

## Backend Architecture
-**Spring Boot 3.x**
- **Java 21**
- **Javascript**
- **Maven**
- **Thymeleaf**
- **Jackson** 
- **HttpClient**

### Frontend Implementation
- **HTML5** met Thymeleaf templating
- **CSS3** met moderne styling en responsive design
- **Vanilla JavaScript** voor interactiviteit
- **Chart.js** externe library voor de grafieken
- **Fetch API** voor asynchrone data loading

## Models & Data Handling
- **APi.java** (`src/main/java/be/ehb/slimmeweervoospelling/model/APi.java`) - Meteo.be API integratie
- **WebsiteController.java** (`src/main/java/be/ehb/slimmeweervoospelling/Controllers/WebsiteController.java`) - Main controller en REST endpoints

## Controllers & Endpoints
- **WebsiteController** - Hoofdpagina routing (`/`, `/weer`, `/History`)
- **NeerslagApiController** - REST API voor historische data (`/api/neerslag/2025`)
- **WeatherController** - Overstromingsrisico endpoints (`/flood-risk`)


## gebruikte API's in deze project
-**Open-Meteo API** : Real-time weervoorspellingen => https://open-meteo.com/
- **Meteo.be API**: Officiële Belgische weerdata voor historische informatie => https://www.meteo.be/en/brussels
- **OpenWeatherMap**: Real-time weervoospellingen + diversiteit in kaarten => https://openweathermap.org/api

### Flood Risk Algorithm
Het overstromingsrisicoalgoritme gebruikt seizoensgebonden drempelwaarden:
- **Winter** (Nov-Jan): 300mm drempel
- **Lente** (Feb-Apr): 250mm drempel
- **Zomer** (Mei-Jul): 260mm drempel
- **Herfst** (Aug-Okt): 280mm drempel

## Installatie
### Vereisten
- Java 21 of hoger
- Maven 3.6+
- Internetverbinding voor API calls
- Moderne webbrowser met JavaScript ondersteuning

### Installatiestappen

1. **Clone de repository**
```bash
git clone [repository-url]
cd Slimme-weersvoorspelling
```

2. **Maven dependencies installeren**
```bash
mvn clean install
```

3. **Applicatie starten**
```bash
mvn spring-boot:run
```

4. **Applicatie bereiken**
```
http://localhost:1070
```

De applicatie draait standaard op poort 1070 zoals geconfigureerd in `application.properties`.


## Algoritme Details

### Overstromingsrisico Berekening
```java
// Seizoensgebonden drempels
Winter (Nov-Jan): 300mm
Lente (Feb-Apr): 250mm  
Zomer (Mei-Jul): 260mm
Herfst (Aug-Okt): 280mm

// Risicobeoordeling
if (maandelijkse_neerslag >= seizoen_drempel) {
    return "⚠️ Overstromingsgevaar gedetecteerd";
} else {
    return "Geen overstromingsgevaar";
}
```

### Data Sources
- **Real-time weather**: Open-Meteo API (gratis, geen API key vereist)
- **Historical data**: Embedded dataset + Meteo.be API voor 2025
- **Coordinates**: GPS coördinaten voor alle ondersteunde gemeenten

## Technische Vereisten Implementatie

| Vereiste | Implementatie Locatie | Beschrijving |
|----------|----------------------|--------------|
| **Spring Boot** | `SlimmeWeervoospellingApplication.java` | Main application class |
| **Thymeleaf Templates** | `src/main/resources/templates/` | Server-side rendering |
| **REST API** | `WebsiteController.java` | `/api/neerslag/2025` endpoint |
| **External API Integration** | `APi.java` | Meteo.be API calls |
| **Responsive Design** | `style.css` | Mobile-first CSS |
| **Chart Visualization** | `Chart.js` | Interactive data graphs |
| **Async Data Loading** | `weer.js`, `History.js` | Fetch API implementation |
| **Error Handling** | Try-catch blocks | Graceful API failure handling |


## Team & Context

**Team**: Group 5  
**Teamleden**: Yazid El Yazghi, Damian Viracocha, Elion Rexhepi, Sorena Mohammad Rafiei Nazari, Kiran Chaud-ry
**Vak**: Programming Project  
**Opdrachtgever**: Aquafin  
**Doelgroep**: Aquafin medewerkers in heel Vlaanderen  
**Academiejaar**: 2024-2025  
**Hogeschool**: Erasmushogeschool Brussel


## Gebruikte Bronnen

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Open-Meteo API Documentation](https://open-meteo.com/en/docs)
- [Meteo.be Open Data](https://opendata.meteo.be/)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Thymeleaf Documentation](https://www.thymeleaf.org/documentation.html)
- AI Assistants:
- GitHub Copilot voor code suggestions en debugging tijdens development
- ChatGPT voor algoritme optimalisatie en documentatie


---
