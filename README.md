![banner](https://cdn.prod.website-files.com/60ff451f4874316baf91d00d/640801740194ae4d1c929104_Benefits%20of%20Modern%20Data%20Platform%20-%20Blogpost%20-%201000x500.png)

# MongoDB Data Platform Project

This is a web application development project completed as part of the CIS 4339 course. The project focuses on enhancing an existing application used by a Houston-area non-profit organization to improve its operations, resource planning, and user experience. The document outlines the steps taken to transition, enhance, and integrate features that improve the application's scalability, maintainability, and user experience.


## Project Overview
The application, originally developed by previous students, is a data platform used by Community Health Workers (CHWs) to organize events, collect client data, and facilitate sign-ups for various services. This project expands upon the existing codebase by introducing new features and refining the application for better maintainability and usability.
Key technologies: **MEVN Stack** (MongoDB, Express, Vue.js, Node.js).


## Scope and Features

### Key Enhancements
1. **Transition to the Composition API**:
   - Refactor the codebase from the Vue Options API to the Composition API for improved maintainability and code organization.
2. **User Authentication and Role-Based Access Control**:
   - Implement secure login functionality with hashed password storage.
   - Role-based access control for two roles: Viewers and Editors.
   - Tailor UI to dynamically display options based on user roles.
3. **Integration of Services at the Data Layer**:
   - Add CRUD functionality for managing event services.
   - Replace hardcoded service data with a dynamic system.
   - Extend API endpoints for real-time service updates.
4. **Dashboard Enhancement with Visualization**:
   - Add Pie or Doughnut charts to visualize client distribution by zip code.
   - Dynamically fetch and display data from API endpoints.

## Deliverables

### Functional Deliverables
- Secure user authentication and authorization.
- Service management features for CRUD operations.
- Enhanced dashboard with dynamic data visualization.

### UI Deliverables
- User-friendly login page and navigation elements.
- Service management pages with intuitive forms.
- Chart components for dashboard visualization.

### Documentation
- Use case diagrams for core features.
- User flow diagrams for authentication and event services.
- Timeline and project schedule for development milestones.

## Team Members
The current iteration is based on development done by:
* Joanna Macedo, Trinity Klein, and Maria Abejide in Spring 2024
* Jeremy Griffith and Edwin Charly in Spring of 2023
* Elliot Farmer Garcia, Agatha	Molski, and Chris Blanco in the Fall of 2022.
  
## Getting Started

### Technologies
- Familiarity with Vue.js, especially the Composition API.
- Understanding of full-stack development with MEVN.

### Data Platform Project Setup
#### Backend Node Application
```
cd backend
```
Follow instructions in the backend README for setup and running as a local instance.

#### Frontend Vue 3 Application
```
cd frontend
```
Follow instructions in frontend README for setup and running as a local instance.


## About the Project

This project was completed collaboratively by **Joanna Macedo**, **Trinity Klein**, and **Maria Abejide** for the CIS 4339 course at the University of Houston under the guidance of **Professor Xuqing Wu**.

---

Feel free to contribute, provide feedback, or discuss improvements!

