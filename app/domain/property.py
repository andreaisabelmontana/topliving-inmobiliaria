"""Pure domain — no Flask, no DB. Easy to unit-test."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

Op   = Literal["sale", "rent"]
Kind = Literal["apartment", "house", "studio", "office", "lot"]


@dataclass(frozen=True)
class Property:
    id: str
    title: str
    type: Kind
    op: Op
    city: str
    neighborhood: str
    price: int          # COP
    beds: int
    baths: int
    area: int           # m²
    parking: int = 0
    year: int | None = None
    badge: str | None = None

    @property
    def price_per_m2(self) -> float:
        if self.area <= 0:
            return 0.0
        return self.price / self.area
