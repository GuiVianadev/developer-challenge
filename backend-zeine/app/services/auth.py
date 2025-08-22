from database.dtos.user import LoginDTO, Token
from database.models.user import User
from fastapi import HTTPException
from repository.auth import AuthRepository
from sqlalchemy.ext.asyncio import AsyncSession
from utils.security import (
    create_access_token,
    verify_password,
)


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

    @staticmethod
    def refresh_user_token(user: User) -> Token:
        new_access_token = create_access_token(
            data_payload={'sub': user.email}
            )
        return {
            'access_token': new_access_token,
            'token_type': 'bearer'
        }
