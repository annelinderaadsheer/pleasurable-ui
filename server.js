import express from 'express';
import fetchJson from './helpers/fetch-json.js';

  // Haal alle data op van de API
  const apiData = await fetchJson('https://fdnd-agency.directus.app/items/dh_services');

  // Maak een nieuwe express app aan
  const app = express();

  // Dit zorgt ervoor dat je JSON kunt ontvangen in POST requests
  app.use(express.json());

  // Stel ejs in als template engine
  app.set('view engine', 'ejs');

  // Stel de map met ejs templates in
  app.set('views', './views');

  // Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
  app.use(express.static('public'));

  // Middleware om url-encoded bodies te parsen
  app.use(express.urlencoded({ extended: true }));

  app.get('/', async function (request, response) {
    // Haal de data op van de API
    const apiData = await fetchJson('https://fdnd-agency.directus.app/items/dh_services');
    console.log('API Data:', apiData);
    // Render de index pagina en geef de data mee
    response.render('index', { services: apiData.data });
  });

    // GET-route voor home pagina
    app.get('/home', function (request, response) {  
      response.render('index')
    });

  // GET-route voor contact pagina
  app.get('/contact', function (request, response) {  
    response.render('contact')
  });
  
  // GET-route voor FAQ pagina
app.get("/faq", function (request, response) {
  response.render("faq");
});

// GET-route voor about pagina
app.get("/about", function (request, response) {
  response.render("about");
});

// GET-route voor FAQ pagina
app.get("/faq", function (request, response) {
  response.render("faq");
});

// GET-route voor opdracht pagina
app.get("/opdracht", function (request, response) {
  response.render("opdracht");
});

// POST-route voor het liken van een initatief
app.post("/like", async function (request, response) {
  const initiatiefId = request.body.initiatiefId;
  const likes = request.body.likes

  console.log("Like verzoek voor service met ID:", initiatiefId);
  
  if (initiatiefId) {
      // Update het aantal likes in de Directus API
      fetchJson(`https://fdnd-agency.directus.app/items/dh_services/${initiatiefId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ likes: Number(likes) + Number(1) })
      }).then((data) => {
          console.log(data);
          console.log("Aantal likes bijgewerkt voor service:", initiatiefId, likes);
          response.redirect("/")

      }).catch((error) => {
          console.error("Error patching likes in Directus API:", error);
      });

  } else {
    // Laat het weten als de service niet gevonden is.
    console.log("Service niet gevonden voor ID:", initiatiefId);
    response.status(404).send("Service niet gevonden");
  }
});

// POST-route om form gegevens te verwerken voor opdracht
app.post("/opdracht", function (request, response) {
  const formData = request.body;

  const newAdvertisement = {
    name: formData.name,
    surname: formData.surname,
    email: formData.email,
    contact: formData.contact,
    title: formData.title,
    short_description: formData.short_description,
    long_description: formData.long_description,
    location: formData.location,
    neighbourhood: formData.neighbourhood,
    start_date: formData.start_date,
    end_date: formData.end_date,
    start_time: formData.start_time,
    end_time: formData.end_time,
  };

  // Gegevens naar de API endpoint sturen
  fetchJson(baseUrl + "/items/dh_services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newAdvertisement),
  }).then((responseFromAPI) => {
    console.log("Response from API:", responseFromAPI);

    // Bijwerken van de gegevens vanuit de API
    fetchData().then((updatedData) => {
      allAdvertisementsData = updatedData;
      response.redirect("/succes");
    }).catch((error) => {
      console.error("Error fetching data from API:", error);
      response.status(500).send("Internal Server Error");
    });
  }).catch((error) => {
    console.error("Error while posting data to API:", error);
    response.status(500).send("Internal Server Error");
  });
});

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000);

// Start express op en luister naar het ingestelde poortnummer
app.listen(app.get('port'), function () {
  // Toon een bericht in de console met het gebruikte poortnummer
  console.log(`Application started on http://localhost:${app.get('port')}`);
});
