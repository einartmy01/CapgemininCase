# CapgemininCase
For case intervju Capgemini

# Energiovervåkingstjeneste

## 1. Implementerte deler
Dette prosjektet implementerer følgende funksjonalitet:  
- **REST API**
    - REST API for energikomponenter: GET, POST, PUT DELETE  
    - Inkludert for individuell GET på `id` eller `name`


- **Database (Node.js + Express + MongoDB med Mongoose)**  
    
    - Hver komponent har: `id`, `name`, `status`, `type` og `lastUpdated`  
- **Frontend (React + Tailwind CSS)**  
  - Viser en liste over alle komponenter (GET) med scrollbar  
  - POST-skjema for å legge til nye komponenter  
  - Slett-knapp for å fjerne komponenter  
  - Middels responsiv design og enkel visuell styling med Tailwind  

---

## 2. Forutsetninger
For å kjøre prosjektet trenger du følgende installert:  
- **Node.js**  
- **npm**  
- **MongoDB** 

## 3. Kjøring av løsningen
1. Go to root folder and run
`npm install`
2. Then run `node server.js`
3. open new terminal and enter `energy-frontend` with `cd /energy-frontend/`
4. run `npm start`
5. go to `http://localhost:3000/`
