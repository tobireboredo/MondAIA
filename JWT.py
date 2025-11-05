from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from sqlmodel import Session, select
import os
from DBstructure import User           # 👈 importa tu modelo User
from DBconnection import get_session   # 👈 importa tu sesión de BD
from dotenv import load_dotenv
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone

load_dotenv()

key = os.getenv("SECRET_KEY", "supersecretkey")
algoritmo = os.getenv("ALGORITHM", "HS256")
expire = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    if not isinstance(password, str):
        raise ValueError("Password must be a string")
    password = password[:72] 
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expiring = datetime.now(timezone.utc) + timedelta(minutes=expire)
    to_encode.update({"exp": expiring})
    encoded_jwt = jwt.encode(to_encode, key, algorithm=algoritmo)
    return encoded_jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/token")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, key, algorithms=[algoritmo])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # 🔹 Buscar al usuario real en la base de datos
    statement = select(User).where(User.username == username)
    db_user = session.exec(statement).first()
    if db_user is None:
        raise credentials_exception
    return db_user  # 👈 devuelve el objeto completo del usuario