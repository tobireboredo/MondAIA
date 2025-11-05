from sqlmodel import SQLModel, Field
from pydantic import BaseModel

class CreateUser(BaseModel):
    username: str
    password: str
    name: str | None = None

class ReadUser(BaseModel):
    id: int
    username: str
    name: str | None = None

class TaskCreate(BaseModel):
    estado: str
    descripcion: str
    task_name: str
    

class TaskRead(BaseModel):
    id: int
    estado: str
    descripcion: str
    task_name: str
    owner_id: int
