from fastapi import HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from database.models.user import User
from database.dtos.user import Token, LoginDTO
from utils.security import (
    create_access_token,
    verify_password,
)
from repository.auth import AuthRepository


class AuthService:
    def __init__(self, db: AsyncSession):
        self.repo = AuthRepository(db)

    async def authenticate_user(self, login_data: LoginDTO) -> Token:
        user = await self.repo.find_user_by_email(login_data.email)
        
        if not user or not verify_password(login_data.password, user.password):
            raise HTTPException(
                status_code=400, 
                detail='Incorrect email or password'
            )

        access_token = create_access_token({'sub': user.email})
        
        return {
            'access_token': access_token, 
            'token_type': 'Bearer'
        }

    def refresh_user_token(self, user: User) -> Token:
        new_access_token = create_access_token(data_payload={'sub': user.email})
        
        return {
            'access_token': new_access_token, 
            'token_type': 'bearer'
        }