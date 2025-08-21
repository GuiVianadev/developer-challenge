from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from utils.security import hash_password

from database.dtos.user import UserCreateDTO
from database.models.user import User


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_users(self):
        result = await self.db.execute(select(User))
        return result.scalars().all()
    
    async def find_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()


    async def create_user(self, user_dto: UserCreateDTO):
        user = User(
            name=user_dto.name,
            email=user_dto.email,
            password=hash_password(user_dto.password)
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
