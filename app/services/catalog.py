"""Catalog service — orchestrates search/sort over a repo."""

from __future__ import annotations

from typing import Iterable

from app.domain.property import Property
from app.repositories.property_repo import PropertyRepo


class CatalogService:
    def __init__(self, repo: PropertyRepo):
        self._repo = repo

    def get(self, pid: str) -> Property | None:
        return self._repo.get(pid)

    def search(
        self,
        op: str | None = None,
        type_: str | None = None,
        city: str | None = None,
        term: str | None = None,
    ) -> list[Property]:
        items: Iterable[Property] = self._repo.all()
        if op:
            items = (p for p in items if p.op == op)
        if type_:
            items = (p for p in items if p.type == type_)
        if city:
            items = (p for p in items if p.city.casefold() == city.casefold())
        if term:
            t = term.casefold()
            items = (
                p for p in items
                if t in p.title.casefold()
                or t in p.neighborhood.casefold()
                or t in p.city.casefold()
            )
        return list(items)
