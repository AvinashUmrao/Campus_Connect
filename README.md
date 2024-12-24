# College Event Management System Web App
## Overview
The College Event Management System is a web application designed to streamline the process of managing and participating in college events. It features separate workflows for users and admins, handling everything from event browsing and registration to event management and user authentication.
## User Workflow
### Actions:
- **Browse available events**
- **Register for events**
- **View registered events**
### Process Flow:
1. User visits the frontend.
2. Sends requests to the backend for event data.
3. Submits registration details to the backend.
4. Backend processes the registration and updates the database.
5. Confirmation is sent back to the user.
## Admin Workflow
### Actions:
- **Login to admin dashboard**
- **Create, update, or delete event listings**
- **View registered students for events**
### Process Flow:
1. Admin logs in through the frontend.
2. Authentication is handled by the backend.
3. Admin modifies event data through the dashboard.
4. Backend updates the database.
5. Admin can view updated event details and registrations.
## Frontend Components
### User Profile:
- Event browsing and registration forms.
- Registered events display.
### Admin Profile:
- Event management dashboard.
## Backend Server
### Responsibilities:
- Handle user and admin authentication.
- Manage API calls for event data and registrations.
- Validate and process user inputs.
## Database
### Tables:
- **Events:** Stores event details (name, date, time, location).
- **Users:** Stores user details and login credentials.
- **Registrations:** Stores event registrations linked to users and events.
- **Admins:** Stores admin details for authentication.
## Data Flow
1. **User to Frontend:** Users interact with the UI to view events or register.
2. **Frontend to Backend:** Data requests (e.g., fetching events or submitting registration).
3. **Backend to Database:** Queries for retrieving or updating event/registration/user data.
4. **Database to Backend:** Provides requested data for events or user registrations.
5. **Backend to Frontend:** Returns processed data to display or confirm actions.
---
