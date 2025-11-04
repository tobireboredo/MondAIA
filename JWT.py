from jose import jwt
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone

load_dotenv()

key = os.getenv("SECRET_KEY")
algoritmo = os.getenv("ALGORITHM")
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
