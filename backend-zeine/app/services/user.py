
from database.models.user import User
from repository.user import UserRepository
from sqlalchemy.ext.asyncio import async_session
from utils.security import hash_password


class UserService:
    def __init__(self, db: async_session):
        self.repo = UserRepository(db)

    async def get_users(self):
        return await self.repo.get_all_users()

    async def create_user(self, user: User):
        user_exist = await self.repo.find_by_email(
            user.email
        )

        if user_exist:
            raise ValueError('Email already exists')
        
        password_hash = hash_password(user.password)

        create_user = User(
            name=user.name,
            email=user.email,
            password=password_hash
        )

        return await self.repo.create_user(create_user)
