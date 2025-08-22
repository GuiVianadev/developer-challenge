from fastapi.security import OAuth2PasswordBearer
from  http import HTTPStatus
from fastapi import Depends, HTTPException
from passlib.context import CryptContext
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from zoneinfo import ZoneInfo
from jwt import decode, encode
from sqlalchemy import select
from jwt.exceptions import ExpiredSignatureError, PyJWTError
from config.settings import Settings
from config.database import get_session
from database.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=('auth/login'))
settings = Settings()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password:str, hashed_password:str)-> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data_payload:dict):
    to_enconde = data_payload.copy()

    expire = datetime.now(tz=ZoneInfo("UTC")) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_enconde.update({'exp': expire})
    encoded_jwt = encode(
        to_enconde, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )

    return encoded_jwt

async def get_current_user(
    session: AsyncSession = Depends(get_session),
    token: str = Depends(oauth2_scheme),
): 
    credentials_exception = HTTPException(
        status_code=HTTPStatus.UNAUTHORIZED,
        detail='Could not validate credentials',
        headers={'WWW-Authenticate': 'Bearer'}
    )

    try:
        payload = decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get('sub')
        if not email:
            raise credentials_exception

    except ExpiredSignatureError:
        raise credentials_exception
    except PyJWTError:
        raise credentials_exception
    
    user = await session.scalar(select(User).where(User.email == email))

    return user
