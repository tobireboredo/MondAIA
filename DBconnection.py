from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import Depends
from sqlmodel import SQLModel, Session
from typing import Annotated

# URL de conexión a la base de datos Neon
DATABASE_URL = "postgresql://neondb_owner:npg_pA91YWdrtBMv@ep-divine-grass-acn65ybf-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require"

# Crear el motor de conexión
engine = create_engine(DATABASE_URL, echo=True)

# Crear las tablas en la base de datos (si no existen)
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Obtener una sesión de base de datos
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]