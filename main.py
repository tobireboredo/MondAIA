from fastapi import FastAPI, Depends, HTTPException, status
import uvicorn
from sqlmodel import Session, select, SQLModel
from DBconnection import get_session, engine
from DBstructure import User, Task
from DBmodels import CreateUser, ReadUser, TaskCreate, TaskRead
import JWT
from JWT import get_current_user
from fastapi.security import OAuth2PasswordRequestForm


app = FastAPI()


@app.get("/")
def read_root():
    return {"message": "¡Hola, mundo!"}

# Crear usuario
@app.post("/users/", response_model=ReadUser)
def create_user(
    user: CreateUser,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)  # ← agrega esto
):
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
        

        return db_user
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
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = JWT.create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer", "id": db_user.id}

@app.post("/task/create", response_model=TaskRead)
def create_task(
    task: TaskCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)  # 🔒 Token requerido
):
    db_task = Task.model_validate(task.model_dump(), update={"owner_id": current_user.id})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)