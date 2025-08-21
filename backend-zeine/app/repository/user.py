from sqlalchemy.orm import Session
from app.database.models.user import User
from app.database.dtos.user import UserCreateDTO

class UserRepository:
    def __init__(self, db:Session):
        self.db = db

    def create_user(self, user_dto: UserCreateDTO):
        user = User(
            name=user_dto.name,
            email=user_dto.email,
            password=user_dto.password
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user