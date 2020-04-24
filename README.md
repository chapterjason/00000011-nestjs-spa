
# NestJS Single Page Application

## Getting Started

There are several `package.json`-Scripts that will help you for several cases.
They are prefixed with `frontend`, `backend` and `docker`.

### Folder Structure

```
nestjs-single-page-application/
├── assets/ - Frontend
│   ├── js/ - Frontend javascript source
│   └── css/ - Frontend css source
├── public/ - Public folder which will be served by the application
├── src/ - The backend javascript source folder
├── templates/ - Templates used by the backend
│   ├── layouts/ - Layouts define different base layout
│   │   └── default.html.twig - Default layout
│   └── base.html.twig - Basic HTML template
```

### Start

Just run the script `./scripts/start.sh`

### Stop

Just run the script `./scripts/stop.sh`
