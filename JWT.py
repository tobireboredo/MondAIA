from jose import jwt
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone

load_dotenv()

key = os.getenv("SECRET_KEY")
algoritmo = os.getenv("ALGORITHM")
expire = os.getenv("ACCES_TOKEN_EXPIRE_MINUTES")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_acces_token(data: dict):
    to_encode = data.copy()
    expiring = datetime.now(timezone.utc) + timedelta(minutes=expire)
    to_encode.update({"exp": expiring})
    encoded_jwt = jwt.encode(to_encode, key, algorithm=algoritmo)
    return encoded_jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login/token")