"""Repository pattern — keeps SQL out of the domain."""

from __future__ import annotations

from typing import Iterable, Protocol

from app.domain.property import Property


class PropertyRepo(Protocol):
    def all(self) -> Iterable[Property]: ...
    def get(self, pid: str) -> Property | None: ...


class InMemoryPropertyRepo:
    def __init__(self, items: list[Property]):
        self._items = list(items)

    def all(self) -> list[Property]:
        return list(self._items)

    def get(self, pid: str) -> Property | None:
        return next((p for p in self._items if p.id == pid), None)

    @classmethod
    def seed(cls) -> "InMemoryPropertyRepo":
        return cls([
            Property("TL-001", "Apartamento moderno en Chicó", "apartment", "sale",
                     "Bogotá", "Chicó Norte", 980_000_000, 3, 2, 112, 2, 2021, "Destacado"),
            Property("TL-002", "Casa campestre en La Calera", "house", "sale",
                     "La Calera", "Vía La Calera", 1_450_000_000, 4, 4, 320, 4, 2018, "Nuevo"),
            Property("TL-003", "Penthouse con vista en Usaquén", "apartment", "sale",
                     "Bogotá", "Usaquén", 2_100_000_000, 4, 4, 220, 3, 2022, "Premium"),
            Property("TL-004", "Apartaestudio en El Poblado", "studio", "rent",
                     "Medellín", "El Poblado", 2_800_000, 1, 1, 45, 1, 2020, "Arriendo"),
        ])
