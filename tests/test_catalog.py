"""Service-level tests — uses the in-memory repo (no I/O)."""

from app.repositories.property_repo import InMemoryPropertyRepo
from app.services.catalog import CatalogService


def _svc():
    return CatalogService(InMemoryPropertyRepo.seed())


def test_search_returns_all_by_default():
    assert len(_svc().search()) == 4


def test_filter_by_op_sale():
    items = _svc().search(op="sale")
    assert all(p.op == "sale" for p in items)
    assert len(items) == 3


def test_filter_by_city_is_case_insensitive():
    assert len(_svc().search(city="bogotá")) == 2


def test_search_by_term_in_neighborhood():
    items = _svc().search(term="chicó")
    assert any("Chicó" in p.neighborhood for p in items)


def test_get_by_id_returns_property():
    p = _svc().get("TL-001")
    assert p is not None and p.title.startswith("Apartamento")


def test_get_unknown_id_returns_none():
    assert _svc().get("TL-DOESNOTEXIST") is None
