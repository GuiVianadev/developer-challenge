from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.models.user import User


class AuthRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def find_user_by_email(self, email: str) -> User | None:
        """Busca usuário pelo email"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()