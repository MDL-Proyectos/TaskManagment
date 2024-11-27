# base-api-express-generator

To run project local

```
npm run dev
```

To run migrations local

```
npm run migrate-dev
```

.env (example)

```
ENV=default
PORT=5000
MONGO_URL=mongodb://127.0.0.1:27017/
MONGO_URL_AUTH_ENABLED=mongodb://user:password@127.0.0.1:27017/
MONGO_DB=default
```

.env.development (example)

```
ENV=development
PORT=4000
MONGO_URL=mongodb://127.0.0.1:27017/
MONGO_URL_AUTH_ENABLED=mongodb://user:password@127.0.0.1:27017/
MONGO_DB=base-api-express-generator
```
{"_id":{"$oid":"6738c0eb10fbfe5da7002dc8"},
  "title": "Título de la tarea",  
  "assigned_team": "Equipo asignado",
  "assigned_user": "Usuario asignado",
  "status": "Nuevo",
  "created_at":  "16/11/2024",  
  "due_date": "",  
  "completed_at":"",
  "comments": [
    {
      "author": "Nombre del autor del comentario",  
      "message": "Texto del comentario",  
      "created_at": "16/11/2024"
    }
  ],
  "project": "Nombre del proyecto",  
  "authorized_by": "Nombre del autorizado",
  "observations": "Observaciones adicionales"
}

{"_id":{"$oid":"6738c58c10fbfe5da7002dca"},
  "first_name": "Lucia",
  "last_name": "Fernandez",
  "password": "qaLider2024",
  "team": "QA",
  "role": "Lider",
  "email": "lucia.fernandez@example.com",
  "phone": "555-123-7890",
  "observations": "Líder del equipo de QA para el Proyecto Beta.",
  "is_deleted": false
}
