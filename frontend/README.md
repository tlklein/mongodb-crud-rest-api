# Data Platform Frontend

This project uses [VueJS 3](https://vuejs.org/) with [Vite](https://vitejs.dev/) and [TailwindCSS](https://tailwindcss.com/).

For form validation [Vuelidate](https://vuelidate-next.netlify.app/) is used.

State management is done via [Pinia](https://pinia.vuejs.org/).


## Requirements

This project uses NodeJS, VUEJS, and MongoDB. This is a summary of the project description. 

### Requirements:
- Update the code from Options API to Composition API. ​
- Add user login capabilities with different roles (viewers and editors). ​
- Implement CRUD functionality for services at the data layer. ​
- Extend the dashboard page with a pie or doughnut chart showing clients by zip code. 

### Sprints:
- Sprint 1: Create a Functional Specification Document 
- Sprint 2: Implement new features in the front using VueJS 


## Project setup

    npm install

### Before startup
You need to either have a local backend running or use a cloud-deployed backend.

Setup a .env file with the following variables, e.g.:

    VITE_ROOT_API=http://localhost:3000

VITE_ROOT_API is the URL for the backend API, either on localhost or in the cloud.
### Compiles and hot-reloads for development

    npm run dev

