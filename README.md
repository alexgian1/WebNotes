# WebNotes

WebNotes is a notes app for creating, editing, and saving notes. It is designed to work locally first, so notes can be stored and loaded right on the device for a fast and simple experience.

An optional database-backed mode can be added later for the notes to be stored on a server instead of only on the local device.

## Prerequisites

- Git
- Node.js 18 or newer with npm
- Java 17

## Project Structure

- `webnotes-frontend` - React frontend
- `webnotes-backend` - Spring Boot backend

## Local Setup

```bash
cd webnotes-frontend
npm install
npm start
```

```bash
cd webnotes-backend
mvnw.cmd spring-boot:run
```
