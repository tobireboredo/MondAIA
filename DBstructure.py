from sqlmodel import SQLModel, Field

class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    username: str
    password: str
    name: str

class Task(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    estado: str
    descripcion: str
    task_name: str
    owner_id: int = Field(foreign_key="user.id")