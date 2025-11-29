import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("uvicorn")

from fastapi import FastAPI, Depends, HTTPException, status, Path
import uvicorn
from sqlmodel import Session, select, SQLModel
from DBconnection import get_session, engine
from DBstructure import User, Task
from DBmodels import CreateUser, ReadUser, TaskCreate, TaskRead
import JWT
from JWT import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["WWW-Authenticate"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"--> {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"<-- {response.status_code} {request.url}")
    return response

@app.get("/")
def read_root():
    return {"message": "¡Hola, mundo!"}

# Crear usuario
@app.post("/users/", response_model=ReadUser)
def create_user(
    user: CreateUser,
    session: Session = Depends(get_session),
    #current_user: str = Depends(get_current_user)  # ← agrega esto
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
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    statement = select(User).where(User.username == form_data.username)
    db_user = session.exec(statement).first()

    if not db_user or not JWT.verify_password(form_data.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = JWT.create_access_token(data={"sub": db_user.username})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "id": db_user.id,
        "username": db_user.username,
        "name": db_user.name,   # AGREGADO
    }

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

# Editar tarea existente
@app.put("/task/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int = Path(..., description="ID de la tarea a actualizar"),
    updated_task: TaskCreate = Depends(),  # Datos nuevos
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Buscar la tarea en la bdd
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    # Verificar el dueño
    if db_task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="No tienes permiso para modificar esta tarea")

    task_data = updated_task.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    session.close()
    return db_task

@app.get("/tasks/user/{user_id}", response_model=list[TaskRead])
def get_tasks_by_user(
    user_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # 🔒 Validamos que el usuario logueado sea el mismo o tenga permisos (admin, por ejemplo)
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para ver las tareas de otro usuario."
        )

    # 🔍 Buscamos todas las tareas que pertenezcan al user_id indicado
    statement = select(Task).where(Task.owner_id == user_id)
    db_tasks = session.exec(statement).all()

    if not db_tasks:
        raise HTTPException(status_code=404, detail="No se encontraron tareas para este usuario")

    return db_tasks

@app.delete("/task/{task_id}")
def delete_task(
    task_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    db_task = session.get(Task, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    if db_task.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para eliminar esta tarea"
        )

    session.delete(db_task)
    session.commit()

    return {"message": f"Tarea con ID {task_id} eliminada correctamente"}



if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)