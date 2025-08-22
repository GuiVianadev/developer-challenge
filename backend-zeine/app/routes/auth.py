from database.dtos.user import LoginDTO, Token
from database.models.user import User
from config.database import get_session
from fastapi import APIRouter, Depends
from services.auth import AuthService
from sqlalchemy.ext.asyncio import AsyncSession
from utils.security import get_current_user
from sqlalchemy.orm import Session

router = APIRouter(prefix='/auth', tags=['auth'])


def get_auth_service(db: AsyncSession = Depends(get_session)):
    return AuthService(db)

@router.post('/login', response_model=Token)
async def login_for_access_token(
    service: AuthService = Depends(get_auth_service),
    login_data: LoginDTO = Depends()
    ):
    return await service.authenticate_user(login_data)


@router.post('/refresh_token', response_model=Token)
def refresh_access_token(
    user: User = Depends(get_current_user)
    ):
    service = AuthService(None)
    return service.refresh_user_token(user)
