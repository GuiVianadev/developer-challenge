from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.models.db_registry import table_registry


@table_registry.mapped_as_dataclass
class Contact:
    __tablename__ = 'contacts'

    id: Mapped[int] = mapped_column(init=False, primary_key=True)
    name: Mapped[str]
    email: Mapped[str] = mapped_column(unique=True)
    telefone: Mapped[str]
    foto: Mapped[str] = mapped_column(nullable=True)
    reference: Mapped[str] = mapped_column(nullable=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    user: Mapped["User"] = relationship("User", back_populates="contacts")
