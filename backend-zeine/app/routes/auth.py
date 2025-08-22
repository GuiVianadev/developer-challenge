from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from config.database import get_session
from database.models.user import User
from database.dtos.user import Token, LoginDTO
from utils.security import get_current_user
from services.auth import AuthService

router = APIRouter(prefix='/auth', tags=['auth'])

@router.post('/login', response_model=Token)
async def login_for_access_token(
    session: AsyncSession = Depends(get_session),
    login_data: LoginDTO = Depends()
    ):
    service = AuthService(session)
    return await service.authenticate_user(login_data)


@router.post('/refresh_token', response_model=Token)
def refresh_access_token(
    user: User = Depends(get_current_user)
    ):
    service = AuthService(None) 
    return service.refresh_user_token(user)