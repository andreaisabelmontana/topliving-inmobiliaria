"""Unit tests for the domain — pure, fast, no I/O."""

from app.domain.property import Property


def _sample() -> Property:
    return Property(
        id="TL-T", title="Test", type="apartment", op="sale",
        city="Bogotá", neighborhood="Chicó", price=980_000_000,
        beds=3, baths=2, area=112,
    )


def test_price_per_m2_is_computed():
    p = _sample()
    assert round(p.price_per_m2) == 8_750_000


def test_price_per_m2_is_zero_for_lot_with_no_area():
    p = Property(
        id="TL-L", title="Lot", type="lot", op="sale",
        city="Rionegro", neighborhood="Llanogrande",
        price=480_000_000, beds=0, baths=0, area=0,
    )
    assert p.price_per_m2 == 0.0


def test_property_is_immutable():
    p = _sample()
    import pytest
    with pytest.raises(Exception):
        p.price = 1  # frozen dataclass — must raise
