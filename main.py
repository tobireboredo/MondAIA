from fastapi import FastAPI, Depends, HTTPException, status
import uvicorn
from sqlmodel import Session, select, SQLModel
from DBconnection import get_session, engine
from DBmodels import User
import JWT
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordRequestForm

SQLModel.metadata.create_all(engine)

app = FastAPI()

class CreateUser(BaseModel):
    username: str
    password: str
    name: str | None = None

@app.get("/")
def read_root():
    return {"message": "¡Hola, mundo!"}

# Crear usuario
@app.post("/users/")
def create_user(user: CreateUser, session: Session = Depends(get_session)):
    try:
        # 🔹 Validamos y truncamos la contraseña a un máximo de 72 caracteres
        if len(user.password) > 72:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La contraseña no puede tener más de 72 caracteres."
            )
        
        password = user.password[:72]  # Truncar la contraseña si es necesario
        hashed_password = JWT.get_password_hash(password)

        db_user = User(username=user.username, password=hashed_password, name=user.name)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)

        return {
            "message": "Usuario creado con éxito",
            "user": {
                "id": db_user.id,
                "username": db_user.username,
                "name": db_user.name
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear el usuario: {str(e)}"
        )

# Login y generación de token
@app.post("/login/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    statement = select(User).where(User.username == form_data.username)
    db_user = session.exec(statement).first()

    if not db_user or not JWT.verify_password(form_data.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
        )

    access_token = JWT.create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)