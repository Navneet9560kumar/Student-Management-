"""add performed_by to activity_log

Revision ID: 7f5a5ccb65c6
Revises: da41cca9e667
Create Date: 2026-07-07 07:01:35.916319

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7f5a5ccb65c6'
down_revision: Union[str, Sequence[str], None] = 'da41cca9e667'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # performed_by columns add karo activity_logs mein
    op.add_column('activity_logs', sa.Column('performed_by_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True))
    op.add_column('activity_logs', sa.Column('performed_by_name', sa.String(length=100), nullable=True))
    op.add_column('activity_logs', sa.Column('performed_by_role', sa.String(length=20), nullable=True))


def downgrade() -> None:
    op.drop_column('activity_logs', 'performed_by_role')
    op.drop_column('activity_logs', 'performed_by_name')
    op.drop_column('activity_logs', 'performed_by_id')
