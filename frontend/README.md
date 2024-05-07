# Data Platform Frontend

This project uses [VueJS 3](https://vuejs.org/) with [Vite](https://vitejs.dev/) and [TailwindCSS](https://tailwindcss.com/).

For form validation [Vuelidate](https://vuelidate-next.netlify.app/) is used.

State management is done via [Pinia](https://pinia.vuejs.org/).

## Requirements

This project uses NodeJS, VUEJS and MongoDB. This is a summary of the project description. 

Project Goal: The project aims to expand an existing web application by adding new features and improving documentation. ​ The application follows a MEVN stack architecture (MongoDB, Express, VueJS, Node) and is a prototype implementation. ​

Background: The application is a basic data platform developed for a non-profit organization in the Houston area. ​It is used by Community Health Workers (CHWs) to help clients with basic needs. ​ The application allows CHWs to enter client information, create events, and sign up clients for events. ​ The data for all organizations is stored in a single database, with each organization having its own instance of the application. ​

Requirements:
- Update the code from Options API to Composition API. ​
- Add user login capabilities with different roles (viewers and editors). ​
- Implement CRUD functionality for services at the data layer. ​
- Extend the dashboard page with a pie or doughnut chart showing clients by zip code. 

Sprints:
- Sprint 1: Create a Functional Specification Document 
- Sprint 2: Implement new features in the frontend using VueJS 


## Project setup

    npm install

### Before startup
You need to either have a local backend running and or use a cloud deployed backend.

Setup a .env file with following variables, e.g.:

    VITE_ROOT_API=http://localhost:3000

VITE_ROOT_API is the URL for the backend API, either on localhost or in the cloud.
### Compiles and hot-reloads for development

    npm run dev

# References
1. Claude Ai
- https://claude.ai/

2. Chat Gpt
- https://chat.openai.com/
