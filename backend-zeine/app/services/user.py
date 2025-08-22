from sqlalchemy.ext.asyncio import async_session

from database.dtos.user import UserCreateDTO
from repository.user import UserRepository


class UserService:
    def __init__(self, db: async_session):
        self.repo = UserRepository(db)

    async def get_users(self):
        return await self.repo.get_all_users()

    async def create_user(self, user_dto: UserCreateDTO):
        user_exist = await self.repo.find_by_email(
            user_dto.email
        )

        if user_exist:
            raise ValueError('Email already exists')
        
        return await self.repo.create_user(user_dto)
