from fastapi import FastAPI
import uvicorn
from DBconnection import SessionDep
from DBmodels import CreateUserDB
from DBstructure import User
app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "¡Hola, mundo!"}

# Ruta para publicar usuarios
@app.post("/users/")
def create_user(user: CreateUserDB, session: SessionDep):
    hashed_password = JWT.get_password_hash(usuario.plain_password)
    extra_data = {"password": hashed_password}
    
    new_user = user.model_dump()
    User.model_validate(new_user, update=extra_data)
    session.add(new_user)
    session.commit()
    session.refresh()
    return {"message": "Usuario creado con éxito", "user": new_user}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)