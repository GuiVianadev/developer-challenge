from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.models.db_registry import table_registry
from app.database.models.contact import Contact

@table_registry.mapped_as_dataclass
class User:
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    name: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str]
    contacts: Mapped[list["Contact"]] = relationship("Contact", back_populates="user")

